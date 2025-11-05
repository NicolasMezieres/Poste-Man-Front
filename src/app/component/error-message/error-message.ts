import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  template: `<span class="text-start text-error font-bold">{{
    message()
  }}</span>`,
})
export class ErrorMessage {
  message = input.required<string>();
}
