import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ButtonActionComponent } from 'src/app/component/button/button-action/button-action';
import { InputFormComponent } from 'src/app/component/input/input-form/input-form';
import { ErrorMessage } from 'src/app/component/error-message/error-message';

@Component({
  selector: 'app-create-section',
  imports: [
    MatIcon,
    ButtonActionComponent,
    InputFormComponent,
    FormsModule,
    ReactiveFormsModule,
    ErrorMessage,
  ],
  template: `<div class="w-full max-w-83.75 p-5 bg-[#DDD0EE] flex flex-col">
    <div class="flex justify-end">
      <button (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <form [formGroup]="formSection" class="flex flex-col gap-10">
      <div>
        <app-input-form
          label="Section"
          placeholder="Section"
          inputId="sectionForm"
          type="text"
          [control]="formSection.controls['name']"
        />
        @if (formSection.controls['name'].touched || isSubmit()) {
          @if (formSection.controls['name'].hasError('required')) {
            <app-error-message message="Ce champ est requis" />
          } @else if (formSection.controls['name'].hasError('minlength')) {
            <app-error-message
              class="text-wrap"
              message="Ce champ doit contenir au moins 2 caractères"
            />
          } @else if (formSection.controls['name'].hasError('maxlength')) {
            <app-error-message
              message="Ce champ ne peut pas dépasser 16 caractères"
            />
          }
        }
      </div>
      <app-button-action
        type="submit"
        [text]="data && data.name ? 'Modifier' : 'Créer'"
        (action)="submit()"
      />
    </form>
  </div>`,
})
export class FormSectionComponent {
  private dialog = inject(MatDialogRef<FormSectionComponent>);
  readonly data = inject<{ name: string }>(MAT_DIALOG_DATA);
  isSubmit = signal<boolean>(false);
  formSection = new FormGroup({
    name: new FormControl(this.data?.name, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(16),
      ],
    }),
  });
  closeDialog() {
    this.dialog.close();
  }
  submit() {
    this.isSubmit.update(() => true);
    if (this.formSection.valid) {
      const dataForm = this.formSection.getRawValue();
      this.dialog.close(dataForm);
    }
  }
}
