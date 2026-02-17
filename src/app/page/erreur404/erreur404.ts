import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo404 } from 'src/app/component/logo404/logo404';

@Component({
  selector: 'app-erreur404',
  imports: [Logo404, RouterLink],
  template: `<div class="flex flex-col text-center h-screen">
    <app-logo404></app-logo404>
    <div
      class="flex flex-col items-center justify-center gap-10 text-[32px] font-Julius mt-2 p-4"
    >
      <p>Poste man ce demande bien ou tu veux allée il y a rien ici.</p>
      <button
        routerLink="/"
        class="border w-[280px] h-[60px] text-[24px] rounded-[10px] bg-[#7C3DD4] text-white font-Agdasima"
      >
        Retour à l'accueil
      </button>
    </div>
  </div>`,
})
export class Erreur404 {}
