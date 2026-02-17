import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatButtonModule],
  template: `<footer
    class="bg-black text-white text-2xl flex justify-around items-center font-Agdasima p-5"
  >
    <button matButton (click)="navigate()" class="">
      <p class="text-white font-Agdasima text-[24px]">Mention Légales</p>
    </button>
    <p>© Copyright 2026</p>
  </footer> `,
})
export class Footer {
  private router = inject(Router);
  readonly dialog = inject(MatDialog);

  navigate() {
    this.dialog.closeAll();
    this.router.navigate(['/mentions']);
  }
}
