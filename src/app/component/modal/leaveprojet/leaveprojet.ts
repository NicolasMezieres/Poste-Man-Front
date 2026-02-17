import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-leaveprojet',
  imports: [MatIcon],
  template: `<div
    class="w-full p-4 bg-[#F5F5F5] flex flex-col gap-6 overflow-scroll"
  >
    <div class="flex justify-end">
      <mat-icon class="" (click)="close()">close</mat-icon>
    </div>
    <section>
      <h1 class="font-Julius text-center text-[24px]">Quitter le projet ?</h1>
    </section>
    <button
      class="p-2 h-[50px] bg-[#D80000] rounded-[10px] text-[#F5F5F5] font-Agdasima text-[24px] text-center mt-4"
    >
      Oui
    </button>
    <button
      class="p-2 h-[50px] bg-[#7C3DD420] rounded-[10px] text-black font-Agdasima text-[24px] text-center mt-4 shadow-[0_1px_2px_rgba(0,0,0,100)]"
    >
      Non
    </button>
  </div>`,
})
export class Leaveprojet {
  private dialogRef = inject(MatDialogRef<Leaveprojet>);

  close() {
    this.dialogRef.close();
  }
}
