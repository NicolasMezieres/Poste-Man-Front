import { Component, inject, model, OnInit } from '@angular/core';
import { Logo } from 'src/app/component/logo/logo';
import { Footer } from 'src/app/component/footer/footer';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth-service';
import { take } from 'rxjs';
import { ToastService } from 'src/app/services/toast/toast';
import { HttpErrorResponseType } from 'src/app/utils/type';

@Component({
  selector: 'app-valid-account',
  imports: [Logo, Footer, MatProgressSpinnerModule],
  template: `<div class="flex flex-col min-h-full bg-white">
    <app-logo />
    <main
      class="flex-1 flex flex-col justify-center items-center gap-20 text-center"
    >
      <h1 class="text-4xl font-Julius">Validation de Compte</h1>
      <h2
        class="text-[32px] font-Julius {{
          message() === undefined
            ? 'text-black'
            : isError()
              ? 'text-error'
              : 'text-black'
        }}"
      >
        {{ message() ? message() : 'Votre compte est en cours de validation' }}
      </h2>
      <mat-spinner />
    </main>
    <app-footer />
  </div> `,
})
export class ValidAccountComponent implements OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #auth = inject(AuthService);
  #toast = inject(ToastService);
  message = model<string>();
  isError = model<boolean>(false);
  token = this.#route.snapshot.queryParamMap.get('token');

  navigate() {
    setTimeout(() => {
      this.#router.navigate(['auth']);
    }, 3000);
  }
  activeAccount() {
    if (!this.token) {
      this.message.set('Token manquant ! Redirection en cours');
      this.isError.set(true);
      this.navigate();
    } else {
      this.#auth
        .activAccount(this.token)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.#toast.openSuccesToast(res.message);
            this.isError.update(() => false);
            this.message.update(() => 'Compte validé ! Redirection en cours');
            this.navigate();
          },
          error: (err: HttpErrorResponseType) => {
            this.#toast.openFailToast(err);
            this.isError.update(() => true);
            this.message.update(() => 'Token incorrect ! Redirection en cours');
            this.navigate();
          },
        });
    }
  }
  ngOnInit(): void {
    this.activeAccount();
  }
}
