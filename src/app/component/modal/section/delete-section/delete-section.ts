import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ButtonDeleteComponent } from 'src/app/component/button/button-delete/button-delete';
import { ButtonCancelComponent } from 'src/app/component/button/button-cancel/button-cancel';

@Component({
  selector: 'app-delete-section',
  imports: [MatIcon, ButtonDeleteComponent, ButtonCancelComponent],
  template: `<div
    class="flex flex-col p-5 pt-14 font-Agdasima gap-5 text-xl w-[335px] text-center"
  >
    <button
      aria-label="close"
      (click)="closeDialog()"
      class="absolute top-5 right-5 h-10"
    >
      <mat-icon fontIcon="close" />
    </button>
    <h1 class="font-Julius text-2xl wrap-anywhere">{{ data.title }}</h1>

    <p class="font-Julius">Cette action et irréversible</p>
    <p class="font-Julius text-xl">
      Supprimer définitivement
      {{ data.isAllSection ? 'toutes les section ' : '' }}?
    </p>

    <app-button-delete type="button" text="Oui" (action)="deleteSection()" />
    <app-button-cancel type="button" text="Non" (action)="closeDialog()" />
  </div> `,
})
export class DeleteSectionComponent {
  private dialog = inject(MatDialogRef<DeleteSectionComponent>);
  readonly data = inject<{ title: string; isAllSection: boolean }>(
    MAT_DIALOG_DATA,
  );
  closeDialog() {
    this.dialog.close();
  }
  deleteSection() {
    this.dialog.close({ isSubmit: true });
  }
}
