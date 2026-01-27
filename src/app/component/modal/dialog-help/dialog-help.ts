import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dialog-help',
  imports: [MatIcon],
  template: `<div
    class="p-6 w-screen h-screen flex flex-col items-center text-center justify-center md:w-full md:h-full"
  >
    <button (click)="close()" class="absolute top-2 right-2">
      <mat-icon>close</mat-icon>
    </button>
    <img [src]="imageHelp()" (error)="close()" class="w-75" alt="Image Help" />
  </div>`,
})
export class DialogHelps implements OnInit {
  private readonly dialogRef = inject(MatDialogRef);
  readonly data = inject<{ screen: string }>(MAT_DIALOG_DATA);
  imageHelp = signal<string>('');
  close() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.imageHelp.set(`assets/help/${this.data.screen}.png`);
  }
}
