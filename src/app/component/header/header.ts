import { Component, inject, input, output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { SideBarComponent } from '../side-bar/side-bar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatIcon, RouterLink],
  template: `<div
    class="h-[150px] flex flex-col p-2 shadow-[0_2px_4px_rgba(0,0,0,0.30)]"
  >
    <div class="flex flex-1 justify-center items-center">
      <img src="/assets/posteman.webp" alt="" class="w-30" />
    </div>
    <mat-icon class="absolute right-4 top-4 text-black" (click)="close()"
      >close</mat-icon
    >
    <div class="flex flex-2 justify-evenly items-center gap-10">
      <mat-icon class="icon-color">notifications</mat-icon>
      <a
        routerLink="/profil"
        class="text-[#7C3DD4] text-[24px] font-Agdasima"
        (click)="close()"
        >{{ username() }}
      </a>
      <button aria-label="deconnexion" (click)="logout.emit()">
        <mat-icon class="icon-color">logout</mat-icon>
      </button>
    </div>
  </div> `,
})
export class Header {
  private dialogRef = inject(MatDialogRef<SideBarComponent>);
  logout = output<void>();
  username = input.required<string>();
  close() {
    this.dialogRef.close();
  }
}
