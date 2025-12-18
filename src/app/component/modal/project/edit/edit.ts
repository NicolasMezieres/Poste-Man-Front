import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ButtonActionComponent } from 'src/app/component/button/button-action/button-action';
import { InputFormComponent } from 'src/app/component/input/input-form/input-form';
import { nameType } from 'src/app/utils/type';
import { ErrorMessage } from 'src/app/component/error-message/error-message';

@Component({
  selector: 'app-edit-project',
  imports: [
    MatIcon,
    ButtonActionComponent,
    InputFormComponent,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    ErrorMessage,
  ],
  template: `<div class="w-80 flex flex-col p-5">
    <button (click)="closeDialog()" aria-label="cancel" class="self-end">
      <mat-icon fontIcon="close" />
    </button>
    <form [formGroup]="formEditProject" class="flex flex-col gap-10">
      <div>
        <app-input-form
          inputId="nameProjectId"
          label="Nom de projet"
          type="text"
          placeholder="Nom de projet"
          [control]="formEditProject.controls['name']"
        />
        @if (formEditProject.controls.name.touched) {
          @if (formEditProject.controls['name'].hasError('required')) {
            <app-error-message message="Ce champs est requis" />
          } @else if (formEditProject.controls['name'].hasError('minlength')) {
            <app-error-message
              message="Ce champs doit contenir au moin 3 caractères"
            />
          } @else if (formEditProject.controls['name'].hasError('maxlength')) {
            <app-error-message
              message="Ce champs ne peut pas dépasser 16 caractères."
            />
          }
        }
      </div>
      <app-button-action
        text="Renommer"
        type="submit"
        (action)="submitFormEdit()"
      />
    </form>
  </div> `,
})
export class EditProjectComponent {
  readonly dialog = inject(MatDialogRef<EditProjectComponent>);
  data: nameType = inject<nameType>(MAT_DIALOG_DATA);
  formEditProject = new FormGroup({
    name: new FormControl(this.data.name, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(16),
      ],
    }),
  });
  closeDialog() {
    this.dialog.close();
  }
  submitFormEdit() {
    if (this.formEditProject.valid) {
      const dataForm = this.formEditProject.getRawValue();
      this.dialog.close({ ...dataForm, isSubmit: true });
    }
  }
}
