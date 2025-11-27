import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-verification',
  imports: [MatIcon],
  templateUrl: './verification.html',
})
export class Verification {
  private dialogRef = inject(MatDialogRef<Verification>);

  close() {
    this.dialogRef.close();
  }
}
