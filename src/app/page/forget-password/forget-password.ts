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
        <h2 class="text-4xl font-Julius">Mot de passe oublier</h2>
        <div>
          <app-input-form
            inputId="EmailForgetPassword"
            label="Email"
            type="email"
            placeholder="Email"
            [control]="formForgetPassword.controls.email"
          />
          @if (formForgetPassword.controls['email'].touched) {
            @if (formForgetPassword.controls.email.hasError('required')) {
              <app-error-message message="Ce champ est requis" />
            } @else if (
              formForgetPassword.controls['email'].hasError('email')
            ) {
              <app-error-message message="Ce n'est pas un email valide" />
            }
          }
        </div>
        <button
          id="submitForgetPassword"
          type="submit"
          (click)="submitFormForgetPassword($event)"
          class="bg-purple text-2xl text-white w-full py-2.5 rounded-[10px] shadowUnset col-span-2 place-self-center xl:w-1/2"
        >
          Confirmer
        </button>
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
