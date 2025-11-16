import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from 'src/app/component/logo/logo';

@Component({
  selector: 'app-erreur500',
  imports: [Logo, RouterLink],
  template: `<div class="flex flex-col text-center h-screen">
    <app-logo></app-logo>
    <div
      class="flex flex-col items-center justify-center gap-4 text-[32px] font-Julius mt-2"
    >
      <p>Une erreur et survenu.</p>
      <p>DÉSOLER POUR LE DÉRANGEMENT OCCASIONNER.</p>
      <p>VEUILLEZ RÉESSAYER PLUS TARD</p>
      <button
        routerLink="/projet"
        class="border w-[280px] h-[60px] text-[24px] rounded-[10px] bg-[#7C3DD4] text-white font-Agdasima"
      >
        Retour à l'accueil
      </button>
    </div>
  </div>`,
})
export class Erreur500 {}
