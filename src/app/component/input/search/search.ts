import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search',
  imports: [],
  template: `<div class="flex flex-col">
    <input
      class="p-2 rounded-[10px] font-Agdasima text-center text-[24px] inset-shadow-[0_0_2px_rgba(0,0,0,0.20)] placeholder:text-[#21212140]"
      placeholder="Rechercher un projet..."
      type="text"
      [value]="search()"
      (input)="searchChange.emit($event.target.value)"
    />
  </div>`,
})
export class Search {
  search = input.required<string>();
  searchChange = output<string>();
}
