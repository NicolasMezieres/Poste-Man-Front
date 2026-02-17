import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Footer } from 'src/app/component/footer/footer';
import { IconBackComponent } from 'src/app/component/icon/back/back';
import { UserService } from 'src/app/services/user/user';
import { HttpErrorResponseType, listUserType } from 'src/app/utils/type';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast';

@Component({
  selector: 'app-list-user',
  imports: [
    MatIcon,
    Footer,
    IconBackComponent,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './list-user.html',
  styleUrl: './list-user.css',
})
export class ListUserPage implements OnInit {
  #userService = inject(UserService);
  #router = inject(Router);
  #toast = inject(ToastService);
  isOpenFilter = signal<boolean>(false);
  page = signal<number>(1);
  totalUser = signal<number>(0);
  isNextPage = signal<boolean>(true);
  listUser = signal<listUserType[]>([]);
  formFilterUser = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    isActive: new FormControl<boolean | null>(null),
  });
  ngOnInit(): void {
    this.searchUser();
  }
  toggleFilter() {
    this.isOpenFilter.update((old) => !old);
  }
  searchUser() {
    const data = this.formFilterUser.getRawValue();
    this.#userService.searchUser({ ...data, page: this.page() }).subscribe({
      next: (res) => {
        this.isOpenFilter.set(false);
        this.listUser.set(res.data);
        this.isNextPage.set(res.isNextPage);
        this.totalUser.set(res.totalUser);
      },
      error: (err: HttpErrorResponseType) => {
        this.#toast.openFailToast(err);
        if (err.status === 401) {
          this.#router.navigate(['auth']);
        }
      },
    });
  }
  submitSearchUser() {
    this.page.set(1);
    this.searchUser();
  }
  changePage(isNext: boolean) {
    if (isNext) {
      this.page.update((old) => old + 1);
    } else {
      this.page.update((old) => old - 1);
    }
    this.searchUser();
  }
}
