import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Logo } from 'src/app/component/logo/logo';

@Component({
  selector: 'app-erreur500',
  imports: [Logo, MatButtonModule],
  template: `<div class="flex flex-col text-center h-screen">
    <app-logo></app-logo>
    <div
      class="flex flex-col items-center justify-center gap-4 text-[32px] font-Julius mt-2"
    >
      <p>Une erreur et survenu.</p>
      <p>DÉSOLER POUR LE DÉRANGEMENT OCCASIONNER.</p>
      <p>VEUILLEZ RÉESSAYER PLUS TARD</p>
      <button
        matButton
        (click)="navigate()"
        class="border w-[280px] h-[60px] text-[24px] rounded-[10px] bg-[#7C3DD4] text-white font-Agdasima"
      >
        Retour à l'accueil
      </button>
    </div>
  </div>`,
})
export class Erreur500 {
  private router = inject(Router);
  readonly dialog = inject(MatDialog);
  navigate() {
    this.dialog.closeAll();
    this.router.navigate(['/']);
  }
}
