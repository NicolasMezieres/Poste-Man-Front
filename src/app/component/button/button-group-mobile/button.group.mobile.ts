import { Component, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ListMemberComponent } from '../../modal/list-member/list-member';
import { MatMenuItem } from '@angular/material/menu';

@Component({
  selector: 'app-button-group-mobile',
  imports: [MatIcon, MatMenuItem],
  template: `<button
    aria-label="show list member"
    mat-menu-item
    (click)="openDialogGroup()"
    class="flex flex-row-reverse gap-2.5 px-2.5 items-center"
  >
    <span class="text-[28px] font-Agdasima text-purple">Membres</span>
    <mat-icon fontIcon="group" class="flex deleteIcon" />
  </button>`,
})
export class buttonGroupMobile {
  readonly dialog = inject(MatDialog);
  projectId = input.required<string>();
  isModerator = input.required<boolean>();
  isAdmin = input.required<boolean>();
  openDialogGroup() {
    this.dialog.open(ListMemberComponent, {
      position: { right: '0' },
      minWidth: '375px',
      panelClass: 'dialog-rectangle',
      data: {
        projectId: this.projectId(),
        isModerator: this.isModerator(),
        isAdmin: this.isAdmin(),
      },
    });
  }
}
