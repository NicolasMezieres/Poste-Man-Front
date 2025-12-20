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
import { ButtonActionComponent } from 'src/app/component/button/button-action/button-action';
import { InputFormComponent } from 'src/app/component/input/input-form/input-form';

@Component({
  selector: 'app-create-section',
  imports: [
    MatIcon,
    ButtonActionComponent,
    InputFormComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  template: `<div class="w-full p-5 bg-[#DDD0EE] flex flex-col">
    <button class="flex justify-end" (click)="closeDialog()">
      <mat-icon>close</mat-icon>
    </button>
    <form [formGroup]="formSection" class="flex flex-col gap-10">
      <div>
        <app-input-form
          label="Section"
          placeholder="Section"
          inputId="sectionForm"
          type="text"
          [control]="formSection.controls['name']"
        />
      </div>
      <app-button-action
        type="submit"
        [text]="data && data.name ? 'Modifier' : 'Renommer'"
        (action)="submit()"
      />
    </form>
  </div>`,
})
export class FormSectionnComponent {
  #dialog = inject(MatDialogRef<FormSectionnComponent>);
  readonly data = inject<{ name: string }>(MAT_DIALOG_DATA);
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
    this.#dialog.close();
  }
  submit() {
    if (this.formSection.valid) {
      const dataForm = this.formSection.getRawValue();
      this.#dialog.close(dataForm);
    }
  }
}
