import { Component, inject, input, output, viewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger, MatMenuItem } from '@angular/material/menu';
import { dialogDeleteMessageComponent } from '../../modal/message/delete-message/delete-message';

@Component({
  selector: 'app-icon-more-message',
  imports: [MatIcon, MatMenu, MatMenuTrigger, MatMenuItem],
  template: `<button
      [matMenuTriggerFor]="menu"
      #menuTrigger
      aria-label="open options"
      class="flex"
    >
      <mat-icon fontIcon="more_horiz" />
    </button>
    <mat-menu #menu="matMenu">
      <button
        aria-label="open dialog delete message"
        mat-menu-item
        (click)="openDialogDeleteMessage()"
        class="flex flex-row-reverse gap-2.5"
      >
        <span class="text-[28px] font-Agdasima text-purple">Supprimer</span>
        <mat-icon fontIcon="delete" class="flex deleteIcon" />
      </button>
    </mat-menu> `,
})
export class IconMoreMessageComponent {
  readonly menuTrigger = viewChild.required(MatMenuTrigger);
  readonly dialog = inject(MatDialog);
  submitDelete = output<void>();
  message = input.required<{ message: string; isAllMessage: boolean }>();
  openDialogDeleteMessage() {
    const dialogDelete = this.dialog.open(dialogDeleteMessageComponent, {
      restoreFocus: false,
      data: this.message(),
    });
    dialogDelete.afterClosed().subscribe((data: { isSubmit: boolean }) => {
      this.menuTrigger().focus();
      if (data && data.isSubmit) {
        this.submitDelete.emit();
      }
    });
  }
}
