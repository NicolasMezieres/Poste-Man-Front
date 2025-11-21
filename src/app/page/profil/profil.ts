import { Component } from '@angular/core';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import { MatIcon } from '@angular/material/icon';
import { IconBackComponent } from 'src/app/component/icon/back/back';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profil',
  imports: [SideBarComponent, MatIcon, IconBackComponent],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class ProfilComponent {
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
}
