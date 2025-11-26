import { Component, inject, model, OnInit, signal } from '@angular/core';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import { MatIcon } from '@angular/material/icon';
import { IconBackComponent } from 'src/app/component/icon/back/back';
import {
  FormControl,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from 'src/app/services/user/user';
import { ToastService } from 'src/app/services/toast/toast';
import { Router } from '@angular/router';
import { HttpErrorResponseType } from 'src/app/utils/type';
import { ErrorMessage } from 'src/app/component/error-message/error-message';

@Component({
  selector: 'app-profil',
  imports: [
    SideBarComponent,
    MatIcon,
    IconBackComponent,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    ErrorMessage,
  ],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class ProfilComponent implements OnInit {
  #user = inject(UserService);
  #toast = inject(ToastService);
  #router = inject(Router);
  username = signal<string>('');
  isDisable = signal<boolean>(true);
  isSubmit = signal<boolean>(false);
  formProfil = new FormGroup({
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(35),
      ],
    }),
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(35),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
        Validators.maxLength(320),
      ],
    }),
    username: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16),
      ],
    }),
  });
  ngOnInit(): void {
    this.formProfil.disable();
    this.#user.myAccount().subscribe({
      next: (res) => {
        this.formProfil.setValue(res.data);
        this.username.set(res.data.username);
      },
      error: (err: HttpErrorResponseType) => {
        this.#toast.openFailToast(err);
        this.#router.navigate(['auth']);
      },
    });
  }
  changeDisabled() {
    this.isDisable.update((oldValue) => !oldValue);
    if (this.isDisable()) {
      this.formProfil.disable();
    } else {
      this.formProfil.enable();
    }
  }
  submitFormProfil(e: Event) {
    e.preventDefault();
    this.isSubmit.update(() => true);
  }
}
