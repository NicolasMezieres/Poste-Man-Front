import { Component, model } from '@angular/core';
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
import { ErrorMessage } from "src/app/component/error-message/error-message";

@Component({
  selector: 'app-reset-password',
  imports: [
    Logo,
    Footer,
    InputFormComponent,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    ErrorMessage
],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordComponent {
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
      return;
    }
  }
}
