import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { ProjectService } from 'src/app/services/project/project';
import { ToastService } from 'src/app/services/toast/toast';
import { HttpErrorResponseType } from 'src/app/utils/type';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProjectComponent } from 'src/app/component/modal/project/delete-project/delete-project';
import { EditProjectComponent } from 'src/app/component/modal/project/edit/edit';
import { LinkComponent } from 'src/app/component/modal/project/link/link';
import { Subscription, take } from 'rxjs';
import { ListMemberComponent } from 'src/app/component/modal/list-member/list-member';

@Component({
  selector: 'app-project',
  imports: [SideBarComponent, RouterLink, MatIcon],
  templateUrl: './project.html',
})
export class ProjectComponent implements OnInit, OnDestroy {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #projectService = inject(ProjectService);
  #toast = inject(ToastService);
  projectId = signal<string>('');
  projectName = signal<string>('');
  isModerator = signal<boolean>(false);
  isAdmin = signal<boolean>(false);
  isVisible = signal<boolean>(false);
  #dialog = inject(MatDialog);
  subscribeRouter!: Subscription;
  ngOnInit(): void {
    this.subscribeRouter = this.#router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.initPage();
      }
    });
    this.initPage();
  }
  ngOnDestroy(): void {
    this.subscribeRouter.unsubscribe();
  }
  initPage() {
    const paramProjectId = this.#route.snapshot.paramMap.get('projectId');
    if (!paramProjectId) {
      this.#router.navigate(['home']);
      return;
    }
    this.projectId.update(() => paramProjectId);
    this.#projectService
      .getProject(paramProjectId)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.projectName.update(() => res.projectName);
          this.isAdmin.update(() => res.isAdmin);
          this.isModerator.update(() => res.isModerator);
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
  toggleVisbile() {
    this.isVisible.update((old) => !old);
  }
  openModalLeave() {
    const isDelete = this.isAdmin() || this.isModerator();

    this.#dialog
      .open(DeleteProjectComponent, {
        data: { isDelete, projectName: this.projectName() },
      })
      .afterClosed()
      .subscribe({
        next: (data: { isLeave: boolean }) => {
          if (data && data.isLeave) {
            this.#leave();
          }
        },
      });
  }
  #leave() {
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
  edit() {
    this.#dialog
      .open(EditProjectComponent, {
        data: { name: this.projectName(), projectId: this.projectId() },
      })
      .afterClosed()
      .subscribe({
        next: (data: { name: string; isSubmit: boolean }) => {
          if (data && data.isSubmit) {
            this.#renameProject(data.name);
          }
        },
      });
  }
  #renameProject(name: string) {
    const data = { name };
    this.#projectService.rename(this.projectId(), data).subscribe({
      next: (res) => {
        this.#toast.openSuccesToast(res.message);
        this.projectName.update(() => name);
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
  openInvitation() {
    this.#projectService.createInvitationLink(this.projectId()).subscribe({
      next: (res) => {
        this.#dialog.open(LinkComponent, { data: { linkId: res.data.id } });
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
  testModal() {
    this.#dialog.open(ListMemberComponent, {
      data: {
        projectId: this.projectId(),
        isModerator: this.isModerator(),
        isAdmin: this.isAdmin(),
      },
    });
  }
}
