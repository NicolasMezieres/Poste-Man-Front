import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ButtonDeleteComponent } from '../../button/button-delete/button-delete';
import { ButtonCancelComponent } from '../../button/button-cancel/button-cancel';

@Component({
  selector: 'app-ban-user',
  imports: [MatIcon, ButtonDeleteComponent, ButtonCancelComponent],
  template: `<div
    class="w-[335px] max-h-screen flex flex-col items-center p-5 gap-5 font-Agdasima overflow-hidden"
  >
    <button aria-label="close Modal" class="flex w-full justify-end">
      <mat-icon (click)="closeDialog()" fontIcon="close" />
    </button>
    <h1 class="font-Julius text-[32px]">{{ data.username }}</h1>
    <h2 class="text-xl font-Julius text-center">
      {{ data.isActive ? 'Désactiver son compte ?' : 'Réactiver son compte ?' }}
    </h2>
    <app-button-delete
      type="button"
      text="Oui"
      class="w-full"
      (action)="submitBan()"
    />
    <app-button-cancel
      type="button"
      text="Non"
      class="w-full"
      (action)="closeDialog()"
    />
  </div> `,
})
export class BanUserDialog {
  readonly dialog = inject(MatDialogRef<BanUserDialog>);
  readonly data = inject<{ username: string; isActive: boolean }>(
    MAT_DIALOG_DATA,
  );
  closeDialog() {
    this.dialog.close();
  }
  submitBan() {
    this.dialog.close({ isSubmit: true });
  }
}
