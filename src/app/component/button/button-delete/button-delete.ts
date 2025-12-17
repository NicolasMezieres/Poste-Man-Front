import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button-delete',
  imports: [],
  template: `<button
    [id]="id()"
    [type]="type()"
    (click)="handleClick($event)"
    class="bg-error text-2xl text-white w-full py-2.5 rounded-[10px] shadowUnset col-span-2 place-self-center"
  >
    {{ text() }}
  </button> `,
})
export class ButtonDeleteComponent {
  type = input.required<string>();
  id = input<string>();
  text = input.required<string>();
  action = output<void>();
  handleClick(e: Event) {
    e.preventDefault();
    this.action.emit();
  }
}
