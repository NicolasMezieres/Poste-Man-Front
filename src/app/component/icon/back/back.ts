import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-icon-back',
  imports: [MatIcon],
  template: `<button
    class="flex"
    (click)="backToTheFuture()"
    aria-label="back to previous page"
  >
    <mat-icon fontIcon="arrow_back" />
  </button>`,
})
export class IconBackComponent {
  #location = inject(Location);
  backToTheFuture() {
    this.#location.back();
  }
}
