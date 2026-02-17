import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ErrorMessage } from 'src/app/component/error-message/error-message';

@Component({
  selector: 'app-create-post',
  imports: [MatIcon, FormsModule, ReactiveFormsModule, ErrorMessage],
  template: `<div class="w-[335px] p-2 bg-purple20 flex flex-col">
    <button class="flex justify-end">
      <mat-icon class="" (click)="close()">close</mat-icon>
    </button>
    <form [formGroup]="formPost" class="flex flex-col p-5 gap-5">
      <label class="font-Julius text-center text-[24px]">Post</label>
      <textarea
        type="text"
        class="w-full h-[200px] bg-white p-4 rounded-[10px] border border-black"
        [formControl]="formPost.controls['text']"
      ></textarea>
      @if (
        formPost.controls['text'].touched || formPost.controls['text'].dirty
      ) {
        @if (formPost.controls['text'].hasError('required')) {
          <app-error-message message="Ce champs est requis" />
        } @else if (formPost.controls['text'].hasError('maxlength')) {
          <app-error-message
            message="Ce champs ne peut pas dépasser 255 caractères."
          />
        }
      }
      <button
        type="submit"
        class="h-[50px] bg-purple rounded-[10px] text-white font-Agdasima text-[24px] text-center"
        (click)="submitCreate()"
      >
        {{ data.text ? 'Modifier' : 'Poster' }}
      </button>
    </form>
  </div> `,
})
export class EditPostComponent {
  private readonly dialogRef = inject(MatDialogRef<EditPostComponent>);
  readonly data = inject<{ text: string }>(MAT_DIALOG_DATA);
  formPost = new FormGroup({
    text: new FormControl(this.data.text, {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
  });
  close() {
    this.dialogRef.close();
  }

  submitCreate() {
    if (this.formPost.valid) {
      const dataForm = this.formPost.getRawValue();
      this.dialogRef.close({ isSubmit: true, ...dataForm });
    }
  }
}
