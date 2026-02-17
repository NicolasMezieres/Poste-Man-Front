import { Component, inject, model, OnInit } from '@angular/core';
import { Logo } from 'src/app/component/logo/logo';
import { Footer } from 'src/app/component/footer/footer';
import { InputFormComponent } from 'src/app/component/input/input-form/input-form';
import {
  FormControl,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { matchPasswords, passwordValidator } from 'src/app/utils/function';
import { ErrorMessage } from 'src/app/component/error-message/error-message';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth-service';
import { ToastService } from 'src/app/services/toast/toast';
import { HttpErrorResponseType } from 'src/app/utils/type';

@Component({
  selector: 'app-reset-password',
  imports: [
    Logo,
    Footer,
    InputFormComponent,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    ErrorMessage,
  ],
  templateUrl: './reset-password.html',
})
export class ResetPasswordComponent implements OnInit {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  token: string = '';
  ngOnInit() {
    const data = this.#route.snapshot.paramMap.get('token');
    if (!data) {
      this.#router.navigate(['']);
      return;
    }
    this.token = data;
  }
  #auth = inject(AuthService);
  #toast = inject(ToastService);
  isSubmit = model<boolean>(false);
  formResetPassword = new FormGroup(
    {
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
    },
    { validators: matchPasswords },
  );
  submitFormResetPassword(e: Event) {
    e.preventDefault();
    this.isSubmit.update(() => true);
    if (this.formResetPassword.valid) {
      const data = this.formResetPassword.getRawValue();
      this.#auth.resetPassword(this.token, data).subscribe({
        next: (res) => {
          this.#toast.openSuccesToast(res.message);
          this.#router.navigate(['auth']);
        },
        error: (err: HttpErrorResponseType) => {
          if (err.status !== 500 && err.status !== 0) {
            this.#router.navigate(['forgetPassword']);
            this.#toast.openFailToast({
              ...err,
              error: { message: 'token expiré' },
            });
          } else {
            this.#toast.openFailToast(err);
          }
        },
      });
    }
  }
}
