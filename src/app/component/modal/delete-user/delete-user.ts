import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ButtonDeleteComponent } from '../../button/button-delete/button-delete';
import { ButtonCancelComponent } from '../../button/button-cancel/button-cancel';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-user',
  imports: [MatIcon, ButtonDeleteComponent, ButtonCancelComponent],
  template: `<div
    class="w-[335px] max-h-screen flex flex-col items-center p-5 gap-5 font-Agdasima overflow-hidden"
  >
    <button aria-label="close Modal" class="flex w-full justify-end">
      <mat-icon (click)="closeDialog()" fontIcon="close" />
    </button>
    <h1 class="font-Julius text-[32px]">{{ data.username }}</h1>
    <h2 class="text-xl font-Agdasima text-center">
      Cette action est irréversible
      <br />
      Supprimer définitivement ce compte ?
    </h2>
    <app-button-delete
      type="button"
      text="Oui"
      class="w-full"
      (action)="submitDeleteUser()"
    />
    <app-button-cancel
      type="button"
      text="Non"
      class="w-full"
      (action)="closeDialog()"
    />
  </div> `,
})
export class DeleteUserDialog {
  readonly dialog = inject(MatDialogRef<DeleteUserDialog>);
  readonly data = inject<{ username: string }>(MAT_DIALOG_DATA);
  closeDialog() {
    this.dialog.close();
  }
  submitDeleteUser() {
    this.dialog.close({ isSubmit: true });
  }
}
