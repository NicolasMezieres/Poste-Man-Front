import { Component, inject, model } from '@angular/core';
import { Logo } from 'src/app/component/logo/logo';
import { Footer } from 'src/app/component/footer/footer';
import { InputFormComponent } from 'src/app/component/input/input-form/input-form';
import {
  FormControl,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { ErrorMessage } from 'src/app/component/error-message/error-message';
import { ToastService } from 'src/app/services/toast/toast';
import { AuthService } from 'src/app/services/auth/auth-service';
import { HttpErrorResponseType } from 'src/app/utils/type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  imports: [
    Logo,
    Footer,
    InputFormComponent,
    ɵInternalFormsSharedModule,
    ErrorMessage,
  ],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPasswordComponent {
  #toast = inject(ToastService);
  #auth = inject(AuthService);
  #router = inject(Router);
  isSubmit = model<boolean>(false);
  formForgetPassword = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });
  submitFormForgetPassword(e: Event) {
    e.preventDefault();
    this.isSubmit.update(() => true);
    if (this.formForgetPassword.valid) {
      const data = this.formForgetPassword.getRawValue();
      this.#auth.forgetPassword(data).subscribe({
        next: (res) => {
          this.#toast.openSuccesToast(res.message);
          this.#router.navigate(['auth']);
        },
        error: (err: HttpErrorResponseType) => {
          this.#toast.openFailToast(err);
        },
      });
    }
  }
}
