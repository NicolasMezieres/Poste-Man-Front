import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project/project';
import { listProjectType } from 'src/app/utils/type';
import { ButtonActionComponent } from '../../button/button-action/button-action';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list-project',
  imports: [MatIcon, ButtonActionComponent, DatePipe],
  templateUrl: './list-project.html',
  styleUrl: './list-project.css',
})
export class ListProjectComponent implements OnInit {
  #dialog = inject(MatDialogRef<ListProjectComponent>);
  readonly data = inject<{ userId: string; username: string }>(MAT_DIALOG_DATA);
  #router = inject(Router);
  #projectService = inject(ProjectService);
  listProject = signal<listProjectType[]>([]);
  totalProject = signal<number>(0);
  isEndList = signal<boolean>(true);
  page = signal<number>(1);
  closeDialog() {
    this.#dialog.close();
  }
  navigateToProject(projectId: string) {
    this.#router.navigate([`/detailProject/${projectId}`]);
    this.#dialog.close();
  }
  ngOnInit(): void {
    this.getListProject();
  }
  getListProject() {
    this.#projectService.getListProjectByUser(this.data.userId).subscribe({
      next: (res) => {
        this.listProject.set(res.data);
        this.totalProject.set(res.totalProject);
        this.isEndList.set(res.isEndList);
      },
    });
  }
  updatePage(isUp: boolean) {
    if (isUp) {
      this.page.update((old) => old + 1);
    } else {
      this.page.update((old) => old - 1);
    }
    this.getListProject();
  }
}
