import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ButtonActionComponent } from 'src/app/component/button/button-action/button-action';
import { environment } from 'src/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-link',
  imports: [MatIcon, ButtonActionComponent],
  templateUrl: './link.html',
})
export class LinkComponent {
  #dialog = inject(MatDialogRef<LinkComponent>);
  #clipboard = inject(Clipboard);
  #url = environment.domain;
  data = inject<{ linkId: string }>(MAT_DIALOG_DATA);
  isCopied = signal<boolean>(false);
  closeDialog() {
    this.#dialog.close();
  }
  copyLink() {
    this.#clipboard.copy(`${this.#url}project/${this.data.linkId}/join`);
    this.isCopied.update(() => true);
  }
}
