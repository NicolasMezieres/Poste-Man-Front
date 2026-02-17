import { Component, inject, model, OnInit, signal } from '@angular/core';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import { IconBackComponent } from 'src/app/component/icon/back/back';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from 'src/app/services/project/project';
import { DatePipe } from '@angular/common';
import { HttpErrorResponseType, projectDetailType } from 'src/app/utils/type';
import { MatDialog } from '@angular/material/dialog';
import { ListMemberComponent } from 'src/app/component/modal/list-member/list-member';
import { DeleteProjectComponent } from 'src/app/component/modal/project/delete-project/delete-project';
import { ToastService } from 'src/app/services/toast/toast';

@Component({
  selector: 'app-detail-project',
  imports: [SideBarComponent, IconBackComponent, RouterLink, DatePipe],
  templateUrl: './detail-project.html',
  styleUrl: './detail-project.css',
})
export class DetailProjectPage implements OnInit {
  #projectService = inject(ProjectService);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #dialog = inject(MatDialog);
  #toast = inject(ToastService);
  projectId = signal<string>('');
  detailData = model<projectDetailType>();
  ngOnInit(): void {
    const params = this.#route.snapshot.paramMap.get('projectId');
    if (!params) {
      this.#router.navigate(['home']);
      return;
    }
    this.projectId.set(params);
    this.#projectService.getDetail(params).subscribe({
      next: (res) => {
        this.detailData.set(res.data);
      },
    });
  }
  openModalListMember() {
    this.#dialog.open(ListMemberComponent, {
      position: { right: '0' },
      minWidth: '375px',
      panelClass: 'dialog-rectangle',
      data: {
        projectId: this.projectId(),
        isModerator: false,
        isAdmin: true,
      },
    });
  }
  openModalDeleteProject() {
    this.#dialog
      .open(DeleteProjectComponent, {
        data: { isDelete: true, projectName: this.detailData()?.projectName },
      })
      .afterClosed()
      .subscribe({
        next: (data: { isLeave: boolean }) => {
          if (data && data.isLeave) {
            this.#projectDelete();
          }
        },
      });
  }
  #projectDelete() {
    this.#projectService.remove(this.projectId()).subscribe({
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
