import { Component } from '@angular/core';
import { IconBackComponent } from '../../icon/back/back';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-header-project-mobile',
  imports: [IconBackComponent, MatIcon],
  templateUrl: './header-project-mobile.html',
  styleUrl: './header-project-mobile.css',
})
export class HeaderProjectMobileComponent {}
