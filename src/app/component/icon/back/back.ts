import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-icon-back',
  imports: [MatIcon],
  template: `<button (click)="backToTheFuture()">
    <mat-icon fontIcon="arrow_back" />
  </button>`,
})
export class BackComponent {
  #location = inject(Location);
  backToTheFuture() {
    this.#location.back();
  }
}
