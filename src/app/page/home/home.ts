import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { SideBarComponent } from "src/app/component/side-bar/side-bar";

@Component({
  selector: 'app-home',
  imports: [MatIcon, SideBarComponent],
  templateUrl: './home.html',
})
export class HomeComponent {}
