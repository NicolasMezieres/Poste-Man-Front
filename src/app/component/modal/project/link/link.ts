import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ButtonActionComponent } from 'src/app/component/button/button-action/button-action';
import { environment } from 'src/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-link',
  imports: [MatIcon, ButtonActionComponent],
  template: `<div
    class="flex flex-col p-5 pt-14 font-Agdasima gap-5 text-xl w-80 text-center"
  >
    <button
      aria-label="close"
      (click)="closeDialog()"
      class="absolute top-5 right-5 h-10"
    >
      <mat-icon fontIcon="close" />
    </button>
    <h1 class="font-Julius text-2xl wrap-anywhere">Invitation</h1>
    <input
      type="text"
      disabled
      [value]="data.linkId"
      class="text-center disabled:bg-disableGray"
    />
    <app-button-action
      type="button"
      [text]="'Copier ' + (isCopied() ? '✓' : '')"
      (action)="copyLink()"
    />
  </div>`,
})
export class LinkComponent {
  private readonly dialog = inject(MatDialogRef<LinkComponent>);
  private readonly clipboard = inject(Clipboard);
  #url = environment.domain;
  data = inject<{ linkId: string }>(MAT_DIALOG_DATA);
  isCopied = signal<boolean>(false);
  closeDialog() {
    this.dialog.close();
  }
  copyLink() {
    this.clipboard.copy(`${this.#url}project/${this.data.linkId}/join`);
    this.isCopied.update(() => true);
  }
}
