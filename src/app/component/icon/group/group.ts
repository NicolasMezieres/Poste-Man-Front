import { Component, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ListMemberComponent } from '../../modal/list-member/list-member';

@Component({
  selector: 'app-icon-group',
  imports: [MatIcon],
  template: `<button aria-label="show list member" (click)="openDialogGroup()">
    <mat-icon fontIcon="group" />
  </button>`,
})
export class IconGroupComponent {
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
