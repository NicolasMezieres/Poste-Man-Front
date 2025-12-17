import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-delete-account',
  imports: [MatIcon],
  templateUrl: './delete-account.html',
  styleUrl: './delete-account.css',
})
export class DeleteAccount {
  private dialogRef = inject(MatDialogRef<DeleteAccount>);

  close() {
    this.dialogRef.close();
  }
}
