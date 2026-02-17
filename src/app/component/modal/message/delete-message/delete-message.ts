import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { ButtonDeleteComponent } from 'src/app/component/button/button-delete/button-delete';
import { ButtonCancelComponent } from 'src/app/component/button/button-cancel/button-cancel';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'dialog-menu-message',
  template: `
    <div
      class="w-[335px] max-h-screen flex flex-col items-center p-5 gap-5 font-Agdasima overflow-hidden"
    >
      <button aria-label="close dialogue" class="flex justify-end w-full">
        <mat-icon (click)="closeDialog()">close</mat-icon>
      </button>
      <h2 class="text-xl text-center font-Julius">
        Cette action et irréversible <br />
        <br />
        {{
          data.isAllMessage
            ? 'Supprimer définitivement tous les messages ?'
            : 'Voulez vous vraiment supprimer le message ?'
        }}
      </h2>
      @if (!data.isAllMessage) {
        <p class="text-xl bg-purple text-white w-full px-2 rounded-[10px]">
          {{ data.message }}
        </p>
      }
      <app-button-delete
        class="w-full"
        type="button"
        text="Oui"
        (action)="submitDeleteMessage()"
      />
      <app-button-cancel
        class="w-full"
        type="button"
        text="Non"
        (action)="closeDialog()"
      />
    </div>
  `,
  imports: [
    MatMenuModule,
    MatDialogModule,
    ButtonDeleteComponent,
    ButtonCancelComponent,
    MatIcon,
  ],
})
export class dialogDeleteMessageComponent {
  readonly dialog = inject(MatDialogRef<dialogDeleteMessageComponent>);
  readonly data = inject<{ message: string; isAllMessage: boolean }>(
    MAT_DIALOG_DATA,
  );
  closeDialog() {
    this.dialog.close();
  }
  submitDeleteMessage() {
    this.dialog.close({ isSubmit: true });
  }
}
