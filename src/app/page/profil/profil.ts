import { Component, inject, OnInit, signal } from '@angular/core';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import { MatIcon } from '@angular/material/icon';
import { IconBackComponent } from 'src/app/component/icon/back/back';
import {
  FormControl,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from 'src/app/services/user/user';
import { ToastService } from 'src/app/services/toast/toast';
import { Router } from '@angular/router';
import { HttpErrorResponseType } from 'src/app/utils/type';
import { ErrorMessage } from 'src/app/component/error-message/error-message';
import { ButtonActionComponent } from 'src/app/component/button/button-action/button-action';
import { ButtonCancelComponent } from 'src/app/component/button/button-cancel/button-cancel';
import { MatDialog } from '@angular/material/dialog';
import { dialogChangePasswordComponent } from 'src/app/component/modal/change-password/change-password';
import { DialogRemoveAccountComponent } from 'src/app/component/modal/delete-account/delete-account';
import { dialogAvatarEditComponent } from 'src/app/component/modal/avatar-edit/avatar-edit';
import { defaultImage } from 'src/app/utils/const';

@Component({
  selector: 'app-profil',
  imports: [
    SideBarComponent,
    MatIcon,
    IconBackComponent,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    ErrorMessage,
    ButtonActionComponent,
    ButtonCancelComponent,
  ],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class ProfilComponent implements OnInit {
  #user = inject(UserService);
  #toast = inject(ToastService);
  #router = inject(Router);
  readonly dialog = inject(MatDialog);
  username = signal<string>('');
  isDisable = signal<boolean>(true);
  isSubmit = signal<boolean>(false);
  defaultImage = defaultImage;
  image = signal<string>('');
  formProfil = new FormGroup({
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(35),
      ],
    }),
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(35),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
        Validators.maxLength(320),
      ],
    }),
    username: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16),
      ],
    }),
  });
  ngOnInit(): void {
    this.formProfil.disable();
    this.#user.myAccount().subscribe({
      next: (res) => {
        console.log(res.data);
        this.formProfil.setValue({
          email: res.data.email,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          username: res.data.username,
        });
        this.username.set(res.data.username);
        if (res.data.icon) {
          this.image.update(() => `/assets/avatar/${res.data.icon}.webp`);
        }
      },
      error: (err: HttpErrorResponseType) => {
        this.#toast.openFailToast(err);
        this.#router.navigate(['auth']);
      },
    });
  }
  changeDisabled() {
    this.isDisable.update((oldValue) => !oldValue);
    if (this.isDisable()) {
      this.formProfil.disable();
    } else {
      this.formProfil.enable();
    }
  }
  submitFormProfil() {
    this.isSubmit.update(() => true);
    if (this.formProfil.valid) {
      const data = this.formProfil.getRawValue();
      this.#user.updateMyAccount(data).subscribe({
        next: (res) => {
          this.#toast.openSuccesToast(res.message);
          this.changeDisabled();
          this.username.update(() => this.formProfil.controls.username.value);
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
  openDialogChangePassword() {
    this.dialog.open(dialogChangePasswordComponent);
  }

  openDialogRemoveAccount() {
    this.dialog
      .open(DialogRemoveAccountComponent)
      .afterClosed()
      .subscribe({
        next: (data: { isSubmit: boolean }) => {
          if (data && data.isSubmit) {
            this.#removeAccount();
          }
        },
      });
  }
  #removeAccount() {
    this.#user.deleteAccount().subscribe({
      next: (res) => {
        this.#toast.openSuccesToast(res.message);
        this.#router.navigate(['auth']);
      },
      error: (err: HttpErrorResponseType) => {
        this.#toast.openFailToast(err);
        if (err.status === 401) {
          this.#router.navigate(['auth']);
        }
      },
    });
  }
  openDialogEditAvatar() {
    this.dialog
      .open(dialogAvatarEditComponent)
      .afterClosed()
      .subscribe((data: { avatarName: string; isSubmit: boolean }) => {
        if (data && data.isSubmit) {
          this.#editAvatar(data.avatarName);
        }
      });
  }
  #editAvatar(image: string) {
    this.#user.changeAvatar(image).subscribe({
      next: (res) => {
        this.#toast.openSuccesToast(res.message);
        this.image.set(`/assets/avatar/${image}.webp`);
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
