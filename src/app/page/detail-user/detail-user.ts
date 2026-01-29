import { Component, inject, model, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user';
import { detailUserType, HttpErrorResponseType } from 'src/app/utils/type';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import { IconBackComponent } from 'src/app/component/icon/back/back';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ListProjectComponent } from 'src/app/component/modal/list-project/list-project';
import { ListMessageComponent } from 'src/app/component/modal/list-message/list-message';
import { BanUserDialog } from 'src/app/component/modal/ban-user/ban-user';
import { ToastService } from 'src/app/services/toast/toast';
import { DeleteUserDialog } from 'src/app/component/modal/delete-user/delete-user';

@Component({
  selector: 'app-detail-user',
  imports: [SideBarComponent, IconBackComponent, DatePipe],
  templateUrl: './detail-user.html',
  styleUrl: './detail-user.css',
})
export class DetailUserPage implements OnInit {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #userService = inject(UserService);
  #dialog = inject(MatDialog);
  #toast = inject(ToastService);
  userId = signal<string>('');
  detailUser = model<detailUserType>();
  ngOnInit(): void {
    const params = this.#route.snapshot.paramMap.get('userId');
    if (!params) {
      this.#router.navigate(['home']);
      return;
    }
    this.userId.set(params);
    this.#userService.getUser(params).subscribe({
      next: (res) => {
        this.detailUser.set(res.data);
      },
    });
  }
  openModalListProject() {
    this.#dialog.open(ListProjectComponent, {
      data: { userId: this.userId(), username: this.detailUser()?.username },
      minWidth: '100vw',
      panelClass: 'dialog-rectangle',
    });
  }
  openModalListMessage() {
    this.#dialog.open(ListMessageComponent, {
      data: { userId: this.userId(), username: this.detailUser()?.username },
      minWidth: '100vw',
      panelClass: 'dialog-rectangle',
    });
  }
  openModalBanUser() {
    this.#dialog
      .open(BanUserDialog, {
        data: {
          username: this.detailUser()?.username,
          isActive: this.detailUser()?.isActive,
        },
      })
      .afterClosed()
      .subscribe({
        next: (data: { isSubmit: boolean }) => {
          if (data && data.isSubmit) {
            this.#banUser();
          }
        },
      });
  }
  #banUser() {
    this.#userService.banUser(this.userId()).subscribe({
      next: (res) => {
        this.#toast.openSuccesToast(res.message);
        if (this.detailUser()) {
          this.detailUser.update((old) =>
            old ? { ...old, isActive: !old.isActive } : old,
          );
        }
      },
      error: (err: HttpErrorResponseType) => {
        this.#toast.openFailToast(err);
        if (err.status === 401) {
          this.#router.navigate(['auth']);
        } else if (err.status === 403 || err.status === 404) {
          this.#router.navigate(['home']);
        }
      },
    });
  }
  openModalDeleteUser() {
    this.#dialog
      .open(DeleteUserDialog, {
        data: { username: this.detailUser()?.username },
      })
      .afterClosed()
      .subscribe({
        next: (data: { isSubmit: boolean }) => {
          if (data && data.isSubmit) {
            this.#deleteUser();
          }
        },
      });
  }
  #deleteUser() {
    this.#userService.deleteUser(this.userId()).subscribe({
      next: (res) => {
        this.#toast.openSuccesToast(res.message);
        this.#router.navigate(['home']);
      },
      error: (err: HttpErrorResponseType) => {
        this.#toast.openFailToast(err);
        if (err.status === 401) {
          this.#router.navigate(['auth']);
        } else if (err.status === 403 || err.status === 404) {
          this.#router.navigate(['home']);
        }
      },
    });
  }
}
