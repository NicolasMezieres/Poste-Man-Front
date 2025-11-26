import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button-action',
  imports: [],
  templateUrl: './button-action.html',
  styleUrl: './button-action.css',
})
export class ButtonActionComponent {
  type = input.required<string>();
  id = input<string>();
  text = input.required<string>();
  action = output<void>();
  handleClick(e: Event) {
    e.preventDefault();
    this.action.emit();
  }
}
