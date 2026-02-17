import { Component, input, output } from '@angular/core';
import { IconBackComponent } from '../../icon/back/back';
import { IconMoreComponent } from '../../icon/more/more';
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: 'app-header-project-mobile',
  imports: [IconBackComponent, IconMoreComponent, MatMenu, MatMenuTrigger],
  templateUrl: './header-project-mobile.html',
  styleUrl: './header-project-mobile.css',
})
export class HeaderProjectMobileComponent {
  title = input.required<string>();
  actionMore = output<void>();
}
