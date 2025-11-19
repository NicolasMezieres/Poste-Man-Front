import { Component } from '@angular/core';
import { SideBarComponent } from "src/app/component/side-bar/side-bar";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-profil',
  imports: [SideBarComponent, MatIcon],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class ProfilComponent {}
