import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-create-post',
  imports: [MatIcon],
  templateUrl: './create-post.html',
  styleUrl: './create-post.css',
})
export class CreatePost {
  private dialogRef = inject(MatDialogRef<CreatePost>);

  close() {
    this.dialogRef.close();
  }
}
