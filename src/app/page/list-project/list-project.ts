import { Component, inject, OnInit, signal } from '@angular/core';
import { Footer } from 'src/app/component/footer/footer';
import { IconBackComponent } from 'src/app/component/icon/back/back';
import { MatIcon } from '@angular/material/icon';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProjectService } from 'src/app/services/project/project';
import { HttpErrorResponseType, projectByAdmin } from 'src/app/utils/type';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastService } from 'src/app/services/toast/toast';
@Component({
  selector: 'app-list-project',
  imports: [
    Footer,
    IconBackComponent,
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
  ],
  templateUrl: './list-project.html',
  styleUrl: './list-project.css',
})
export class ListProjectComponent implements OnInit {
  isOpenFilter = signal<boolean>(false);
  #projectService = inject(ProjectService);
  #toast = inject(ToastService);
  #router = inject(Router);
  page = signal<number>(1);
  totalProject = signal<number>(0);
  isEndList = signal<boolean>(true);
  listProject = signal<projectByAdmin[]>([]);
  formFilterProject = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    fromDate: new FormControl('', { nonNullable: true }),
    toDate: new FormControl('', { nonNullable: true }),
  });
  toggleFilter() {
    this.isOpenFilter.update((old) => !old);
  }
  ngOnInit(): void {
    this.searchProject();
  }
  submitSearchProject() {
    this.page.set(1);
    this.searchProject();
  }
  searchProject() {
    const data = this.formFilterProject.getRawValue();
    this.#projectService
      .searchByAdmin({ ...data, page: this.page() })
      .subscribe({
        next: (res) => {
          this.isOpenFilter.update(() => false);
          this.totalProject.update(() => res.total);
          this.isEndList.update(() => res.isEndList);
          this.listProject.update(() => res.data);
        },
        error: (err: HttpErrorResponseType) => {
          this.#toast.openFailToast(err);
          if (err.status === 401) {
            this.#router.navigate(['auth']);
          }
        },
      });
  }
  changePage(isNext: boolean) {
    if (isNext) {
      this.page.update((old) => old + 1);
    } else {
      this.page.update((old) => old - 1);
    }
    this.searchProject();
  }
}
