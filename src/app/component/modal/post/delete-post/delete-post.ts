import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { postType } from 'src/app/utils/type';
import { MatIcon } from '@angular/material/icon';
import { ButtonDeleteComponent } from 'src/app/component/button/button-delete/button-delete';
import { ButtonCancelComponent } from 'src/app/component/button/button-cancel/button-cancel';
import { CardPostComponent } from 'src/app/component/card/post/post';

@Component({
  selector: 'app-delete-post',
  imports: [
    MatIcon,
    ButtonDeleteComponent,
    ButtonCancelComponent,
    CardPostComponent,
  ],
  template: `<div
    class="w-[335px] max-h-screen flex flex-col items-center p-5 gap-5 font-Agdasima overflow-hidden"
  >
    <button class="flex w-full justify-end">
      <mat-icon class="" (click)="closeDialog()">close</mat-icon>
    </button>
    <h1 class="text-2xl font-Julius text-center">
      Cette action et irréversible
    </h1>
    <h2 class="text-xl font-Julius text-center">
      {{
        data.isAllPost
          ? 'Supprimer définitivement tous les postes ?'
          : 'Supprimer définitivement ce post ?'
      }}
    </h2>
    @if (!data.isAllPost) {
      <app-card-post [post]="data.post" />
    }
    <app-button-delete
      type="button"
      text="Oui"
      class="w-full"
      (action)="submitDeletePost()"
    />
    <app-button-cancel
      type="button"
      text="Non"
      class="w-full"
      (action)="closeDialog()"
    />
  </div>`,
})
export class DeletePostComponent {
  private readonly dialog = inject(MatDialogRef<DeletePostComponent>);
  readonly data = inject<{ post: postType; isAllPost: boolean }>(
    MAT_DIALOG_DATA,
  );
  closeDialog() {
    this.dialog.close();
  }
  submitDeletePost() {
    this.dialog.close({ isSubmit: true });
  }
}
