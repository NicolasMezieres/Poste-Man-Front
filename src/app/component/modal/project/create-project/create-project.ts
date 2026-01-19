import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-create-project',
  imports: [MatIcon, ReactiveFormsModule],
  templateUrl: './create-project.html',
})
export class CreateProject {
  private dialogRef = inject(MatDialogRef<CreateProject>);
  // #project = inject(ProjectService);
  // isSubmit = signal<boolean>(false);
  // control = input.required<FormControl>();
  // type = input.required<string>();

  // formCreateProject = new FormGroup({
  //   name: new FormControl('', {
  //     nonNullable: true,
  //     validators: [
  //       Validators.required,
  //       Validators.minLength(1),
  //       Validators.maxLength(16),
  //     ],
  //   }),
  // });
  // submitFormCreateProject() {
  //   this.isSubmit.update(() => true);
  //   if (this.formCreateProject.valid) {
  //     const data = this.formCreateProject.getRawValue();
  //   }
  // }

  close() {
    this.dialogRef.close();
  }
}
