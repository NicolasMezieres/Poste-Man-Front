import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Header } from '../../header/header';
import { Create } from '../../button/create/create';
import { Search } from '../../input/search/search';
import { Footer } from '../../footer/footer';
import { ɵInternalFormsSharedModule } from '@angular/forms';
import { HttpErrorResponseType, searchProjectType } from 'src/app/utils/type';
import { ProjectService } from 'src/app/services/project/project';
import { ToastService } from 'src/app/services/toast/toast';
import { Router, RouterLink } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth-service';
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
  #authService = inject(AuthService);
  #projectService = inject(ProjectService);
  #toast = inject(ToastService);
  #router = inject(Router);
  private dialog = inject(MatDialogRef<MenuComponent>);
  page = signal<number>(1);
  search = signal<string>('');
  projects = signal<searchProjectType[]>([]);
  username = signal<string>('');
  debounceSearch = toSignal(toObservable(this.search).pipe(debounceTime(500)));
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
    this.#projectService.search({ search: '', page: 1 }).subscribe({
      next: (res) => {
        this.projects.update(() => res.data);
        this.username.set(res.user.username);
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
    this.dialog.close();
  }
  submitLogout() {
    this.#logout();
  }
  #logout() {
    this.#authService.logout().subscribe({
      next: (res) => {
        this.#toast.openSuccesToast(res.message);
        this.#router.navigate(['auth']);
        this.closeDialog();
      },
    });
  }
}
