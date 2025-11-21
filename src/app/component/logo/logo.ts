import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [],
  template: `<div class="mt-[5px] flex flex-col items-center">
    <img src="assets/posteman.webp" alt="logo" />
    <h1 class="font-Alumni text-2xl md:text-5xl">POSTE MAN</h1>
  </div> `,
})
export class Logo {}
