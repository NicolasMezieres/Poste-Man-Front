import { Component, input, model } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Logo } from '../../component/logo/logo';
import { Footer } from '../../component/footer/footer';
import { InputFormComponent } from '../../component/input/input-form/input-form';
import { RouterLink } from '@angular/router';
import { ErrorMessage } from '../../component/error-message/error-message';
import { matchPasswords, passwordValidator } from '../../utils/function';
import { MatCheckbox } from '@angular/material/checkbox';
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
  isSubmit = false;
  formConnexion = new FormGroup({
    identifier: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  formRegister = new FormGroup(
    {
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(35),
      ]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.maxLength(35),
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(320),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(16),
        passwordValidator,
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      terme: new FormControl(false, [Validators.requiredTrue]),
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
    console.log(this.formRegister.controls, this.formRegister.errors);
    if (this.formRegister.valid) {
      console.log('valid');
    }
  }
  submitFormConnexion(event: Event) {
    event.preventDefault();
    this.isSubmit = true;
    if (this.formConnexion.valid) {
      console.log('valid');
    }
  }
}
