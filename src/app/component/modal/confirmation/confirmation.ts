import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-confirmation',
  imports: [MatIcon],
  templateUrl: './confirmation.html',
})
export class Confirmation {
  private dialogRef = inject(MatDialogRef<Confirmation>);

  close() {
    this.dialogRef.close();
  }
}
