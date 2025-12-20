import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from "@angular/material/icon";
import { ButtonDeleteComponent } from "src/app/component/button/button-delete/button-delete";
import { ButtonCancelComponent } from "src/app/component/button/button-cancel/button-cancel";

@Component({
  selector: 'app-delete-section',
  imports: [MatIcon, ButtonDeleteComponent, ButtonCancelComponent],
  templateUrl: './delete-section.html',
  styleUrl: './delete-section.css',
})
export class DeleteSectionComponent {
  #dialog = inject(MatDialogRef<DeleteSectionComponent>);
  readonly data = inject<{ title: string; isAllSection: boolean }>(
    MAT_DIALOG_DATA,
  );
  closeDialog() {
    this.#dialog.close();
  }
  deleteSection() {
    this.#dialog.close({ isSubmit: true });
  }
}
