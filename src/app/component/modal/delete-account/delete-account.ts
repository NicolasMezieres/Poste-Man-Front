import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-delete-account',
  imports: [MatIcon],
  template: ` <div
    class="w-full max-w-[335px] p-5 bg-white flex flex-col gap-6 overflow-hidden"
  >
    <div class="flex justify-end">
      <mat-icon (click)="close()">close</mat-icon>
    </div>
    <h1 class="font-Agdasima text-center text-[24px]">
      Cette action est irréversible
    </h1>
    <h2 class="font-Agdasima text-center text-[24px]">
      Voulez-vous vraiment supprimer définitevement vôtre compte ?
    </h2>
    <button
      (click)="submitRemoveAccount()"
      aria-label="submit remove account"
      class="p-2 h-[50px] bg-[#D80000] rounded-[10px] text-[#F5F5F5] font-Agdasima text-[24px] text-center mt-4"
    >
      Oui
    </button>
    <button
      (click)="close()"
      aria-label="close dialog"
      class="p-2 h-[50px] bg-[#7C3DD4] rounded-[10px] text-[#F5F5F5] font-Agdasima text-[24px] text-center mt-4"
    >
      Non
    </button>
  </div>`,
})
export class DialogRemoveAccountComponent {
  private dialogRef = inject(MatDialogRef<DialogRemoveAccountComponent>);

  close() {
    this.dialogRef.close();
  }
  submitRemoveAccount() {
    this.dialogRef.close({ isSubmit: true });
  }
}
