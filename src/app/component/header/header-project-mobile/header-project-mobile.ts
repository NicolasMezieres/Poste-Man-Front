import { Component, input, output } from '@angular/core';
import { IconBackComponent } from '../../icon/back/back';
import { IconMoreComponent } from '../../icon/more/more';

@Component({
  selector: 'app-header-project-mobile',
  imports: [IconBackComponent, IconMoreComponent],
  templateUrl: './header-project-mobile.html',
  styleUrl: './header-project-mobile.css',
})
export class HeaderProjectMobileComponent {
  title = input.required<string>();
  actionMore = output<void>();
}
