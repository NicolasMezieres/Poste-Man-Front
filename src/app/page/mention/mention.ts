import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Logo } from 'src/app/component/logo/logo';

@Component({
  selector: 'app-mention',
  imports: [Logo, MatIcon],
  template: `<div>
    <mat-icon>arrow_back</mat-icon>
    <app-logo></app-logo>
  </div>`,
})
export class Mention {}
