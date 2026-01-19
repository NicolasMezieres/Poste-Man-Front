import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateProject } from '../../modal/project/create-project/create-project';

@Component({
  selector: 'app-create',
  imports: [],
  template: `<div class="flex flex-col">
    <button
      class="p-2 h-[50px] bg-[#7C3DD4] rounded-[10px] text-[#F5F5F5] font-Agdasima text-[24px] text-center shadow-[0_1px_2px_rgba(0,0,0,100)]"
      (click)="openModal()"
    >
      Crée un projet
    </button>
  </div>`,
})
export class Create {
  private readonly dialog = inject(MatDialog);
  openModal() {
    this.dialog.open(CreateProject);
  }
}
