import { Component } from '@angular/core';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';

@Component({
  selector: 'app-home',
  imports: [SideBarComponent],
  templateUrl: './home.html',
})
export class HomeComponent {}
