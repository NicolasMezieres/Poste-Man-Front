import { Component } from '@angular/core';
import { Header } from '../../header/header';
import { Create } from '../../button/create/create';
import { Search } from '../../input/search/search';
import { Project } from '../../project/project';
import { Footer } from '../../footer/footer';

@Component({
  selector: 'app-menu',
  imports: [Header, Create, Search, Project, Footer],
  template: `<div
    class="w-screen h-screen max-w-[375px] animate-slide-in-right bg-[#F5F5F5] flex flex-col fixed"
  >
    <app-header></app-header>
    <div class="p-4 flex-1 flex flex-col overflow-hidden">
      <div class="flex flex-col m-4 gap-4">
        <app-create></app-create>
        <app-search></app-search>
      </div>
      <hr />
      <app-project class="overflow-scroll removeScrollbar"></app-project>
    </div>
    <app-footer></app-footer>
  </div>`,
})
export class MenuComponent {}
