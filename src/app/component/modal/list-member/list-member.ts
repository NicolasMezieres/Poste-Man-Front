import { Component, inject, OnInit, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AuthSocketService } from 'src/app/services/auth/auth-socket';
import { HttpErrorResponseType, member } from 'src/app/utils/type';
import { MatIcon } from '@angular/material/icon';
import { Member } from '../../member/member';
import { DialogKickUser } from '../group/kick-user/kick-user';
import { ProjectService } from 'src/app/services/project/project';
import { ToastService } from 'src/app/services/toast/toast';
import { Router } from '@angular/router';
import { DialogBanUser } from '../group/ban-user/ban-user';

@Component({
  selector: 'app-list-member',
  imports: [MatIcon, Member],
  templateUrl: './list-member.html',
})
export class ListMemberComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ListMemberComponent>);
  readonly dialog = inject(MatDialog);
  readonly data = inject<{
    projectId: string;
    isModerator: boolean;
    isAdmin: boolean;
  }>(MAT_DIALOG_DATA);
  #authSocket = inject(AuthSocketService);
  #projectService = inject(ProjectService);
  #toast = inject(ToastService);
  #router = inject(Router);
  members = signal<member[]>([]);
  closeDialog() {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.#authSocket
      .connectedListMember(this.data.projectId)
      .then((data) => this.members.update(() => data))
      .catch(() => {
        console.log('coucou erreur');
        this.closeDialog();
      });
    this.detectChange();
  }
  detectChange() {
    this.#authSocket.listenAuth().subscribe({
      next: (data) => {
        switch (data.type) {
          case 'online':
            this.members.update((listMember) =>
              listMember.map((member) => {
                if (member.userId === data.userId) {
                  member.isConnected = true;
                }
                return member;
              }),
            );
            break;
          case 'offline':
            this.members.update((listMember) =>
              listMember.map((member) => {
                if (member.userId === data.userId) {
                  member.isConnected = false;
                }
                return member;
              }),
            );
            break;
          case 'userJoinProject':
            if (data.type === 'userJoinProject') {
              const newData = {
                isBanned: data.isBanned,
                isConnected: data.isConnected,
                userId: data.userId,
                user: data.user,
              } as member;
              this.members.update((listMember) => [...listMember, newData]);
            }
            break;
          case 'userLeaveProject':
            this.members.update((listMember) =>
              listMember.filter((member) => member.userId != data.userId),
            );
            break;
          case 'userBanned':
            this.members.update((listMember) =>
              listMember.map((member) => {
                if (member.userId === data.userId) {
                  member.isBanned = true;
                }
                return member;
              }),
            );
            break;
          case 'userUnBanned':
            this.members.update((listMember) =>
              listMember.map((member) => {
                if (member.userId === data.userId) {
                  member.isConnected = data.isConnected || false;
                  member.isBanned = false;
                }
                return member;
              }),
            );
            break;
          case 'banned':
            this.#authSocket.deconnection();
            this.dialogRef.close();
            this.#router.navigate(['home']);
            break;
          case 'kicked':
            this.#authSocket.deconnection();
            this.dialogRef.close();
            this.#router.navigate(['home']);
            break;
        }
      },
    });
  }
  openDialogKickUser(member: member) {
    this.dialog
      .open(DialogKickUser, { data: member })
      .afterClosed()
      .subscribe({
        next: (data: { isSubmit: boolean; userId: string }) => {
          if (data && data.isSubmit) {
            this.#kickUser(member.userId);
          }
        },
      });
  }
  #kickUser(userId: string) {
    this.#projectService.kickUser(this.data.projectId, userId).subscribe({
      next: (res) => {
        this.#toast.openSuccesToast(res.message);
      },
      error: (err: HttpErrorResponseType) => {
        this.#toast.openFailToast(err);
        if (err.status === 401) {
          this.#router.navigate(['auth']);
        } else if (err.status === 404 || err.status === 403) {
          this.#router.navigate(['home']);
        }
      },
    });
  }
  openDialogBanUser(member: member) {
    this.dialog
      .open(DialogBanUser, { data: { member } })
      .afterClosed()
      .subscribe({
        next: (data: { isSubmit: boolean; userId: string }) => {
          if (data && data.isSubmit) {
            this.#banUser(member.userId);
          }
        },
      });
  }
  #banUser(userId: string) {
    this.#projectService.ban(this.data.projectId, userId).subscribe({
      next: (res) => {
        this.#toast.openSuccesToast(res.message);
      },
      error: (err: HttpErrorResponseType) => {
        this.#toast.openFailToast(err);
        if (err.status === 401) {
          this.#router.navigate(['auth']);
        } else if (err.status === 404 || err.status === 403) {
          this.#router.navigate(['home']);
        }
      },
    });
  }
}
