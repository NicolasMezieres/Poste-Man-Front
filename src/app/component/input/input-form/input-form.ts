import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-form',
  imports: [ReactiveFormsModule],
  templateUrl: './input-form.html',
  styleUrl: './input-form.css',
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
