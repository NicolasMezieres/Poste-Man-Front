import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { ButtonDeleteComponent } from 'src/app/component/button/button-delete/button-delete';
import { ButtonCancelComponent } from 'src/app/component/button/button-cancel/button-cancel';

@Component({
  selector: 'dialog-menu-message',
  template: `
    <h2>Voulez vou vraiment supprimer le message ?</h2>
    <p>Message</p>
    <app-button-delete
      type="button"
      text="Oui"
      (action)="submitDeleteMessage()"
    />
    <app-button-cancel type="button" text="Non" (action)="closeDialog()" />
  `,
  imports: [
    MatMenuModule,
    MatDialogModule,
    ButtonDeleteComponent,
    ButtonCancelComponent,
  ],
})
export class dialogDeleteMessageComponent {
  readonly dialog = inject(MatDialogRef<dialogDeleteMessageComponent>);
  closeDialog() {
    this.dialog.close();
  }
  submitDeleteMessage() {
    this.dialog.close({ isSubmit: true });
  }
}
