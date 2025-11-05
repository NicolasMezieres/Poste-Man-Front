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
import { ErrorMessage } from "../../component/error-message/error-message";
@Component({
  selector: 'app-auth',
  imports: [Logo, Footer, ReactiveFormsModule, InputFormComponent, RouterLink, ErrorMessage],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class AuthComponent {
  formRegister = new FormGroup({
    identifier: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  formConnexion = new FormGroup({
    identifier: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  isRegisterModel = model<boolean>(false);
  isRegister = input.required({
    transform: (value: string) =>
      value === 'true'
        ? this.isRegisterModel.set(true)
        : this.isRegisterModel.set(false),
  });
  changeForm(value: boolean) {
    this.isRegisterModel.update(() => value);
  }
  submitFormRegister(event: Event) {
    event.preventDefault();
  }
  submitFormConnexion(event: Event) {
    event.preventDefault();
    console.log(this.formConnexion.value);
  }
}
