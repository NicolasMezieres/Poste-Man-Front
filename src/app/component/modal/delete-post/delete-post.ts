import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-delete-post',
  imports: [MatIcon],
  templateUrl: './delete-post.html',
})
export class DeletePost {
  private dialogRef = inject(MatDialogRef<DeletePost>);

  close() {
    this.dialogRef.close();
  }
}
