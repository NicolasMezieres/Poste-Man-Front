import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ErrorMessage } from 'src/app/component/error-message/error-message';
import { InputFormComponent } from 'src/app/component/input/input-form/input-form';

@Component({
  selector: 'app-create-project',
  imports: [MatIcon, InputFormComponent, ErrorMessage, ReactiveFormsModule],
  templateUrl: './create-project.html',
})
export class CreateProject {
  private dialogRef = inject(MatDialogRef<CreateProject>);
  isSubmit = signal<boolean>(false);
  formCreateProject = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
  });
  close() {
    this.dialogRef.close();
  }
}
