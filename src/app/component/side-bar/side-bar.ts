import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-side-bar',
  imports: [MatIcon],
  template: `<aside
    class="flex flex-col h-screen px-2.5 py-5 gap-10 bg-modal border-r"
  >
    <mat-icon fontIcon="menu" />
    <ng-content></ng-content>
    <mat-icon fontIcon="help_center" class="absolute bottom-5" />
  </aside> `,
})
export class SideBarComponent {}
