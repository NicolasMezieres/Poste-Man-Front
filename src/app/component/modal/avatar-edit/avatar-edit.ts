import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-avatar-edit',
  imports: [MatIcon],
  template: `<div class="w-[335px] flex flex-col text-center p-5 gap-5">
    <button
      aria-label="close dialog"
      class="absolute right-4"
      (click)="closeDialog()"
    >
      <mat-icon fontIcon="close" />
    </button>
    <h1 class="font-Julius text-[32px]">Choisir un nouvel avatar</h1>
    <ul class="flex justify-around">
      <li>
        <button
          aria-label="choose cat"
          class="rounded-[50%] w-16 h-16 border"
          (click)="submitEditAvatar('cat')"
        >
          <img
            class="rounded-[50%] w-full h-full object-contain"
            src="/assets/avatar/cat.webp"
            alt="avatar cat"
          />
        </button>
      </li>
      <li>
        <button
          aria-label="choose fox"
          class="rounded-[50%] w-16 h-16 border"
          (click)="submitEditAvatar('fox')"
        >
          <img
            class="rounded-[50%] w-full h-full object-contain"
            src="/assets/avatar/fox.webp"
            alt="avatar fox"
          />
        </button>
      </li>
      <li>
        <button
          aria-label="choose squirrel"
          class="rounded-[50%] w-16 h-16 border"
          (click)="submitEditAvatar('squirrel')"
        >
          <img
            class="rounded-[50%] w-full h-full object-contain object-right"
            src="/assets/avatar/squirrel.webp"
            alt="avatar squirrel"
          />
        </button>
      </li>
    </ul>
  </div> `,
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
