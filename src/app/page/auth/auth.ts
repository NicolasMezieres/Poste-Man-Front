import { Component, input, model } from '@angular/core';
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
// import { AuthService } from './auth-service';
// import { take } from 'rxjs';
// import { dataSignupType } from 'src/app/utils/type';
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
  // #auth = inject(AuthService);
  isSubmit = false;
  formConnexion = new FormGroup({
    identifier: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  formRegister: FormGroup = new FormGroup(
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
    if (this.formRegister.valid) {
      // const data = this.formRegister.value;
      // this.#auth.signup(data).pipe(take(1)).subscribe({});
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
