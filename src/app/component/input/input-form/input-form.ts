import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-form',
  imports: [ReactiveFormsModule],
  template: `<div class="flex flex-col">
    <label class="text-xl font-bold" [for]="inputId()">{{ label() }}* : </label>
    <input
      [id]="inputId()"
      [type]="type()"
      class="text-center text-xl bg-white shadowCast rounded-[5px] py-2 placeholder:text-placeholder"
      [placeholder]="placeholder() + '...'"
      (change)="updateValue($event.target.value)"
      [formControl]="control()"
    />
  </div>`,
})
export class InputFormComponent {
  inputId = input.required<string>();
  label = input.required<string>();
  type = input.required<string>();
  placeholder = input.required<string>();
  control = input.required<FormControl>();
  value = output<string | number>();
  updateValue(data: string) {
    this.value.emit(data);
  }
}
