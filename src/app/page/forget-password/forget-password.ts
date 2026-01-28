import { Component, inject, model } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonActionComponent } from 'src/app/component/button/button-action/button-action';
import { ErrorMessage } from 'src/app/component/error-message/error-message';
import { Footer } from 'src/app/component/footer/footer';
import { InputFormComponent } from 'src/app/component/input/input-form/input-form';
import { Logo } from 'src/app/component/logo/logo';
import { AuthService } from 'src/app/services/auth/auth-service';
import { ToastService } from 'src/app/services/toast/toast';
import { HttpErrorResponseType } from 'src/app/utils/type';

@Component({
  selector: 'app-forget-password',
  imports: [
    Logo,
    Footer,
    InputFormComponent,
    ɵInternalFormsSharedModule,
    ErrorMessage,
    ButtonActionComponent,
  ],
  template: `<div class="flex flex-col bg-white min-h-screen">
    <app-logo />
    <main
      class="flex-1 flex flex-col items-center p-5 font-Agdasima justify-center gap-5"
    >
      <h1 class="text-[32px] font-Julius">Authentification</h1>
      <form
        formGroup="formForgetPassword"
        class="bg-purple20 rounded-[10px] border p-10 flex flex-col gap-10"
      >
        <h2 class="text-4xl font-Julius text-center">Mot de passe oublier</h2>
        <div>
          <app-input-form
            inputId="EmailForgetPassword"
            label="Email"
            type="email"
            placeholder="Email"
            [control]="formForgetPassword.controls.email"
          />
          @if (formForgetPassword.controls['email'].touched || isSubmit()) {
            @if (formForgetPassword.controls.email.hasError('required')) {
              <app-error-message message="Ce champ est requis" />
            } @else if (
              formForgetPassword.controls['email'].hasError('email')
            ) {
              <app-error-message message="Ce n'est pas un email valide" />
            }
          }
        </div>
        <app-button-action
          class="max-w-72 w-full col-span-2 place-self-center"
          type="submit"
          id="submitForgetPassword"
          text="Confirmer"
          (action)="submitFormForgetPassword()"
        />
      </form>
    </main>
    <app-footer />
  </div> `,
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
  submitFormForgetPassword() {
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
