import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ButtonDeleteComponent } from 'src/app/component/button/button-delete/button-delete';
import { ButtonCancelComponent } from 'src/app/component/button/button-cancel/button-cancel';

@Component({
  selector: 'app-delete-project',
  imports: [MatIcon, ButtonDeleteComponent, ButtonCancelComponent],
  template: `<div
    class="flex flex-col p-5 pt-14 font-Agdasima gap-5 text-xl w-80 text-center"
  >
    <button
      aria-label="close"
      (click)="closeDialog()"
      class="absolute top-5 right-5 h-10"
    >
      <mat-icon fontIcon="close" />
    </button>
    <h1 class="font-Julius text-2xl wrap-anywhere">{{ data.projectName }}</h1>
    @if (data.isDelete) {
      <p class="font-Julius">Cet action et irréversible</p>
      <p class="font-Julius">Supprimer définitivement toutes les section ?</p>
    } @else {
      <p class="font-Julius">Voulez vous vraiment quitter le projet ?</p>
    }
    <app-button-delete type="button" text="Oui" (action)="leaveProject()" />
    <app-button-cancel type="button" text="Non" (action)="closeDialog()" />
  </div>`,
})
export class DeleteProjectComponent {
  dialog = inject(MatDialogRef<DeleteProjectComponent>);
  data = inject<{ isDelete: boolean; projectName: string }>(MAT_DIALOG_DATA);
  closeDialog() {
    this.dialog.close();
  }
  leaveProject() {
    this.dialog.close({ isLeave: true });
  }
}
