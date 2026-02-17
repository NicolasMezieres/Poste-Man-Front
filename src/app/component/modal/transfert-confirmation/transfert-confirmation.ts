import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-transfert-confirmation',
  imports: [MatIcon],
  templateUrl: './transfert-confirmation.html',
  styleUrl: './transfert-confirmation.css',
})
export class TransfertConfirmation {
  private dialogRef = inject(MatDialogRef<TransfertConfirmation>);

  close() {
    this.dialogRef.close();
  }
}
