import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ButtonActionComponent } from 'src/app/component/button/button-action/button-action';
import { ButtonDeleteComponent } from 'src/app/component/button/button-delete/button-delete';
import { ButtonCancelComponent } from "src/app/component/button/button-cancel/button-cancel";

@Component({
  selector: 'app-delete-project',
  imports: [MatIcon, ButtonActionComponent, ButtonDeleteComponent, ButtonCancelComponent],
  templateUrl: './delete-project.html',
  styleUrl: './delete-project.css',
})
export class DeleteProjectComponent {
  dialog = inject(MatDialogRef<DeleteProjectComponent>);
  closeDialog() {
    this.dialog.close();
  }
}
