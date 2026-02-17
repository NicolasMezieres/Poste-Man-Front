import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
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
  private readonly dataModal = inject<{ closeModal: () => void }>(
    MAT_DIALOG_DATA,
  );
  isSubmit = signal<boolean>(false);
  #projectService = inject(ProjectService);
  #router = inject(Router);
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
          this.#router.navigate([`/project/${res.data.projectId}`]);
          this.close();
          this.dataModal.closeModal();
        },
        error: (err: HttpErrorResponseType) => {
          this.#toast.openFailToast(err);
          if (err.status === 401) {
            this.#router.navigate(['auth']);
          }
        },
      });
    }
  }
  close() {
    this.dialogRef.close();
  }
}
