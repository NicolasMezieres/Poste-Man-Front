import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { postType } from 'src/app/utils/type';
import { MatIcon } from '@angular/material/icon';
import { ButtonDeleteComponent } from 'src/app/component/button/button-delete/button-delete';
import { ButtonCancelComponent } from 'src/app/component/button/button-cancel/button-cancel';

@Component({
  selector: 'app-delete-post',
  imports: [DatePipe, MatIcon, ButtonDeleteComponent, ButtonCancelComponent],
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
      Supprimer définitivement ce post ?
    </h2>
    <article class="w-72 flex flex-col overflow-y-auto">
      <header
        class="flex justify-between bg-purple text-white border border-black rounded-t-[5px] px-5 py-2"
      >
        <div class="flex items-center gap-2.5">
          <button aria-label="upVote" class="flex items-center">
            <mat-icon fontIcon="arrow_upward" class="arrowIcon" />
          </button>
          <span class="text-xl">{{ data.score }}</span>
          <button aria-label="downVote" class="flex items-center">
            <mat-icon fontIcon="arrow_downward" class="arrowIcon" />
          </button>
        </div>
        <h2 class="text-2xl wrap-anywhere text-center">
          {{ data.user.username }}
        </h2>
      </header>
      <p
        [id]="data.id"
        class="text-xl flex-1 p-2 border rounded-b-[5px] bg-white disabled:bg-white whitespace-pre-line"
      >
        {{ data.text }}
      </p>
      <time datetime="01/01/1111 01:01" class="text-end text-xl py-2.5"
        >{{ data.createdAt | date: 'dd/MM/yyyy HH:mm' }}
      </time>
    </article>
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
  readonly data = inject<postType>(MAT_DIALOG_DATA);
  closeDialog() {
    this.dialog.close();
  }
  submitDeletePost() {
    this.dialog.close({ isSubmit: true });
  }
}
