import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-avatar-edit',
  imports: [MatIcon],
  templateUrl: './avatar-edit.html',
  styleUrl: './avatar-edit.css',
})
export class dialogAvatarEditComponent {
  readonly dialog = inject(MatDialogRef);
  closeDialog() {
    this.dialog.close();
  }
  submitEditAvatar(avatarName: string) {
    this.dialog.close({ avatarName, isSubmit: true });
  }
}
