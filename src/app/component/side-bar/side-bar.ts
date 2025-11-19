import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-side-bar',
  imports: [MatIcon],
  template: `<aside
    class="flex flex-col h-screen px-2.5 py-5 gap-5 bg-modal border-r"
  >
    <mat-icon fontIcon="menu" />
    <ng-content></ng-content>
  </aside> `,
})
export class SideBarComponent {}
