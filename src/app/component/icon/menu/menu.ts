import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Header } from '../../header/header';
import { Create } from '../../button/create/create';
import { Search } from '../../input/search/search';
import { Footer } from '../../footer/footer';
import { ɵInternalFormsSharedModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponseType, searchProjectType } from 'src/app/utils/type';
import { ProjectService } from 'src/app/services/project/project';
import { ToastService } from 'src/app/services/toast/toast';
import { Router, RouterLink } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-menu',
  imports: [
    Header,
    Create,
    Search,
    Footer,
    ɵInternalFormsSharedModule,
    MatIcon,
    RouterLink,
  ],
  templateUrl: 'menu.html',
})
export class MenuComponent implements OnInit {
  #projectService = inject(ProjectService);
  #toast = inject(ToastService);
  #router = inject(Router);
  #dialog = inject(MatDialogRef<MenuComponent>);
  search = signal<string>('');
  page = signal<number>(1);
  debounceSearch = toSignal(toObservable(this.search).pipe(debounceTime(500)));
  projects = signal<searchProjectType[]>([]);
  updateSearch = effect(() => {
    const delay = this.debounceSearch();
    if (delay) {
      if (this.page() !== 1) {
        this.page.update(() => 1);
      }
      this.searchProject();
    }
  });
  searchProject() {
    this.#projectService
      .search({ search: this.search(), page: this.page() })
      .subscribe({
        next: (res) => {
          this.projects.update(() => res.data);
        },
        error: (err: HttpErrorResponseType) => {
          this.#toast.openFailToast(err);
          if (err.status === 401) {
            this.#router.navigate(['auth']);
            this.closeDialog();
          }
        },
      });
  }
  ngOnInit(): void {
    this.searchProject();
  }
  closeDialog() {
    this.#dialog.close();
  }
}
