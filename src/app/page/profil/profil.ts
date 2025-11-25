import { Component, inject, model, OnInit, signal } from '@angular/core';
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

@Component({
  selector: 'app-profil',
  imports: [
    SideBarComponent,
    MatIcon,
    IconBackComponent,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class ProfilComponent implements OnInit {
  #user = inject(UserService);
  #toast = inject(ToastService);
  #router = inject(Router);
  isDisable = signal<boolean>(true);
  formProfil = new FormGroup({
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });
  ngOnInit(): void {
    this.formProfil.disable();
    this.#user.myAccount().subscribe({
      next: (res) => {
        this.formProfil.setValue(res.data);
        console.log(this.formProfil.value);
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
}
