import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ButtonDeleteComponent } from 'src/app/component/button/button-delete/button-delete';
import { ButtonCancelComponent } from 'src/app/component/button/button-cancel/button-cancel';

@Component({
  selector: 'app-dialog-kick-user',
  imports: [MatIcon, ButtonDeleteComponent, ButtonCancelComponent],
  template: `<div
    class="w-[335px] max-h-screen p-5 gap-5 flex flex-col font-Agdasima overflow-hidden"
  >
    <button
      aria-label="close dialog"
      (click)="closeDialog()"
      class="absolute right-4 top-4"
    >
      <mat-icon fontIcon="close" />
    </button>
    <h1 class="text-2xl font-Julius text-center">
      Cette action supprimeras tous les postes et messages de cette utilisateur
    </h1>
    <app-button-delete
      (action)="submitKickUser()"
      [disabled]="isDisable()"
      [text]="textDelay()"
      type="button"
    />
    <app-button-cancel (action)="closeDialog()" text="Annuler" type="button" />
  </div>`,
})
export class DialogKickUser implements OnInit {
  readonly dialog = inject(MatDialogRef<DialogKickUser>);
  textDelay = signal<string>('3');
  isDisable = signal<boolean>(true);
  ngOnInit(): void {
    const delay = setInterval(() => {
      if (this.textDelay() === '1') {
        clearInterval(delay);
      }
      this.textDelay.update((oldValue) => String(Number(oldValue) - 1));
      if (this.textDelay() === '0') {
        this.textDelay.update(() => 'Confirmer');
        this.isDisable.update(() => false);
      }
    }, 1000);
  }
  closeDialog() {
    this.dialog.close();
  }
  submitKickUser() {
    this.dialog.close({ isSubmit: true });
  }
}
