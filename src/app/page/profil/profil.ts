import { Component } from '@angular/core';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import { MatIcon } from '@angular/material/icon';
import { IconBackComponent } from 'src/app/component/icon/back/back';

@Component({
  selector: 'app-profil',
  imports: [SideBarComponent, MatIcon, IconBackComponent],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class ProfilComponent {}
