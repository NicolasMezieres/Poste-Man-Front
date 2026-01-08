import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { matchPasswords, passwordValidator } from 'src/app/utils/function';
import { ErrorMessage } from '../../error-message/error-message';

@Component({
  selector: 'app-verification',
  imports: [MatIcon, FormsModule, ReactiveFormsModule, ErrorMessage],
  templateUrl: './change-password.html',
})
export class dialogChangePasswordComponent {
  private dialogRef = inject(MatDialogRef<dialogChangePasswordComponent>);
  formChangePassword = new FormGroup({
    oldPassword: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(255),
        passwordValidator,
      ],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(255),
        passwordValidator,
      ],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, matchPasswords],
    }),
  });
  close() {
    this.dialogRef.close();
  }
  submitChangePassword() {
    if (this.formChangePassword.valid) {
      const formData = this.formChangePassword.getRawValue();
      this.dialogRef.close({ isSubmit: true, formData });
    }
  }
}
