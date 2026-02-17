import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button-cancel',
  imports: [],
  template: `<button
    [id]="id()"
    [type]="type()"
    (click)="handleClick($event)"
    class="bg-purple20 text-2xl w-full py-2.5 rounded-[10px] shadowUnset col-span-2 place-self-center"
  >
    {{ text() }}
  </button> `,
})
export class ButtonCancelComponent {
  type = input.required<string>();
  id = input<string>();
  text = input.required<string>();
  action = output<void>();
  handleClick(e: Event) {
    e.preventDefault();
    this.action.emit();
  }
}
