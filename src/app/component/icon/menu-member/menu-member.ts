import { Component, inject, input, output, viewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-menu-member',
  imports: [MatIcon, MatMenuItem, MatMenu, MatMenuTrigger],
  template: `<button
      class="flex"
      aria-label="open dialog option member"
      [matMenuTriggerFor]="menu"
      #menuTrigger
    >
      <mat-icon fontIcon="settings" />
    </button>
    <mat-menu #menu="matMenu">
      <button
        aria-label="open dialog kick User"
        mat-menu-item
        (click)="kickUser.emit()"
      >
        <span class="text-[28px] font-Agdasima text-purple text-center">
          Exclure
        </span>
      </button>
      <hr />
      <button
        aria-label="open dialog kick User"
        mat-menu-item
        (click)="banUser.emit()"
        class="text-[28px] font-Agdasima text-purple"
      >
        <span class="text-[28px] font-Agdasima text-purple">
          {{ isBan() ? 'Débannir' : 'Bannir' }}
        </span>
      </button>
    </mat-menu>`,
})
export class MenuMemberComponent {
  readonly menuTrigger = viewChild.required(MatMenuTrigger);
  readonly dialog = inject(MatDialog);
  isBan = input.required<boolean>();
  kickUser = output<void>();
  banUser = output<void>();
}
