import { Component, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-icon-more',
  imports: [MatIcon],
  template: `<button
    aria-label="open options"
    (click)="handleClick()"
    class="flex"
  >
    <mat-icon fontIcon="more_horiz" />
  </button>`,
})
export class IconMoreComponent {
  action = output<void>();
  handleClick() {
    this.action.emit();
  }
}
