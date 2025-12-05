import { Component, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-icon-help',
  imports: [MatIcon],
  template: `<button class="flex" (click)="actionHelp.emit()">
    <mat-icon fontIcon="help_center" class="absolute bottom-5" />
  </button>`,
})
export class IconHelpComponent {
  actionHelp = output<void>();
}
