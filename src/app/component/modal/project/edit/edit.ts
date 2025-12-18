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
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class EditProjectComponent {
  #dialog = inject(MatDialogRef<EditProjectComponent>);
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
    this.#dialog.close();
  }
  submitFormEdit() {
    if (this.formEditProject.valid) {
      const dataForm = this.formEditProject.getRawValue();
      this.#dialog.close({ ...dataForm, isSubmit: true });
    }
  }
}
