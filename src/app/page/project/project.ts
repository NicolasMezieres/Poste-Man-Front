import { Component, inject, OnInit, signal } from '@angular/core';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from 'src/app/services/project/project';
import { ToastService } from 'src/app/services/toast/toast';
import { HttpErrorResponseType } from 'src/app/utils/type';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProjectComponent } from 'src/app/component/modal/project/delete-project/delete-project';

@Component({
  selector: 'app-project',
  imports: [SideBarComponent, RouterLink, MatIcon],
  templateUrl: './project.html',
})
export class ProjectComponent implements OnInit {
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
  ngOnInit(): void {
    const paramProjectId = this.#route.snapshot.paramMap.get('projectId');
    if (!paramProjectId) {
      this.#router.navigate(['home']);
      return;
    }
    this.projectId.update(() => paramProjectId);
    this.#projectService.getProject(paramProjectId).subscribe({
      next: (res) => {
        console.log(res);
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
  leaveProject() {
    if (this.isAdmin() || this.isModerator()) {
      this.#dialog.open(DeleteProjectComponent);
    }
  }
}
