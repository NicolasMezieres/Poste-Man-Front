import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [MatButtonModule],
  template: `<footer
    class="bg-black text-white text-2xl flex justify-around font-Agdasima p-5"
  >
    <button matButton (click)="navigate()">Mention légale</button>
    <p>© Copyright 2025</p>
  </footer> `,
  styleUrl: './footer.css',
})
export class Footer {
  private router = inject(Router);
  readonly dialog = inject(MatDialog);

  navigate() {
    this.dialog.closeAll();
    this.router.navigate(['/mentions']);
  }
}
