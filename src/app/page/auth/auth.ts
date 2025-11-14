import { Component, inject, input, model } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Logo } from 'src/app/component/logo/logo';
import { Footer } from 'src/app/component/footer/footer';
import { InputFormComponent } from 'src/app/component/input/input-form/input-form';
import { RouterLink } from '@angular/router';
import { ErrorMessage } from 'src/app/component/error-message/error-message';
import { matchPasswords, passwordValidator } from 'src/app/utils/function';
import { MatCheckbox } from '@angular/material/checkbox';
import { AuthService } from '../../services/auth/auth-service';
import { ToastService } from 'src/app/services/toast/toast';
import { HttpErrorResponseType } from 'src/app/utils/type';
@Component({
  selector: 'app-auth',
  imports: [
    Logo,
    Footer,
    ReactiveFormsModule,
    InputFormComponent,
    RouterLink,
    ErrorMessage,
    MatCheckbox,
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class AuthComponent {
  #toast = inject(ToastService);
  #auth = inject(AuthService);
  isSubmit = false;
  formConnexion = new FormGroup({
    identifier: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });
  formRegister = new FormGroup(
    {
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(35)],
      }),
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(35)],
      }),
      username: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(16),
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
      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(16),
          passwordValidator,
        ],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      terme: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
    },
    { validators: matchPasswords },
  );
  isRegisterModel = model<boolean>(false);
  isRegister = input.required({
    transform: (value: string) =>
      value === 'true'
        ? this.isRegisterModel.set(true)
        : this.isRegisterModel.set(false),
  });
  changeForm(value: boolean) {
    this.isRegisterModel.update(() => value);
    this.isSubmit = false;
  }
  submitFormRegister(event: Event) {
    event.preventDefault();
    this.isSubmit = true;
    if (this.formRegister.valid) {
      const data = this.formRegister.getRawValue();
      this.#auth.signup(data).subscribe({
        next: (res) => {
          this.#toast.openSuccesToast(res.message);
        },
        error: (err: HttpErrorResponseType) => {
          this.#toast.openFailToast(err);
        },
      });
    }
  }
  submitFormConnexion(event: Event) {
    event.preventDefault();
    this.isSubmit = true;
    if (this.formConnexion.valid) {
      const data = this.formConnexion.getRawValue();
      this.#auth.signin(data).subscribe({
        next: (res) => {
          this.#toast.openSuccesToast(res.message);
        },
        error: (err: HttpErrorResponseType) => {
          this.#toast.openFailToast(err);
        },
      });
    }
  }
}
