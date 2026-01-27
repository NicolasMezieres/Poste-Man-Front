import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MenuComponent } from '../icon/menu/menu';
import { DialogHelps } from '../modal/dialog-help/dialog-help';

@Component({
  selector: 'app-side-bar',
  imports: [MatIcon],
  template: `<aside
    class="flex flex-col h-screen px-2.5 py-5 gap-10 bg-modal border-r"
  >
    <button aria-label="open menu burger" (click)="openMenu()">
      <mat-icon fontIcon="menu" />
    </button>
    <ng-content></ng-content>
  </aside> `,
})
export class SideBarComponent {
  private readonly dialog = inject(MatDialog);
  openMenu() {
    this.dialog.open(MenuComponent, {
      position: { top: '0', left: '0' },
    });
  }
  openHelp() {
    this.dialog.open(DialogHelps);
  }
}
