import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ButtonActionComponent } from 'src/app/component/button/button-action/button-action';
import { ErrorMessage } from 'src/app/component/error-message/error-message';
import { InputFormComponent } from 'src/app/component/input/input-form/input-form';
import { ProjectService } from 'src/app/services/project/project';
import { ToastService } from 'src/app/services/toast/toast';
import { HttpErrorResponseType } from 'src/app/utils/type';

@Component({
  selector: 'app-create-project',
  imports: [
    MatIcon,
    InputFormComponent,
    ErrorMessage,
    ReactiveFormsModule,
    ButtonActionComponent,
  ],
  templateUrl: './create-project.html',
})
export class CreateProject {
  private dialogRef = inject(MatDialogRef<CreateProject>);
  isSubmit = signal<boolean>(false);
  #projectService = inject(ProjectService);
  #toast = inject(ToastService);
  formCreateProject = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
  });

  submitFromCreate() {
    this.isSubmit.update(() => true);
    if (this.formCreateProject.valid) {
      const data = this.formCreateProject.getRawValue();
      this.#projectService.create(data).subscribe({
        next: (res) => {
          this.#toast.openSuccesToast(res.message);
        },
        error: (err: HttpErrorResponseType) => {
          this.#toast.openFailToast(err);
        },
      });
    }
  }
  close() {
    this.dialogRef.close();
  }
}
