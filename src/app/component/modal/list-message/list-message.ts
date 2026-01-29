import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message/message';
import { ToastService } from 'src/app/services/toast/toast';
import { HttpErrorResponseType, messageUserType } from 'src/app/utils/type';
import { MatIcon } from '@angular/material/icon';
import { IconMoreMessageComponent } from '../../icon/more-message/more-message';

@Component({
  selector: 'app-list-message',
  imports: [MatIcon, IconMoreMessageComponent],
  templateUrl: './list-message.html',
  styleUrl: './list-message.css',
})
export class ListMessageComponent implements OnInit {
  #dialog = inject(MatDialogRef<ListMessageComponent>);
  readonly data = inject<{ userId: string; username: string }>(MAT_DIALOG_DATA);
  #router = inject(Router);
  #toast = inject(ToastService);
  #messageService = inject(MessageService);
  listMessage = signal<messageUserType[]>([]);
  totalMessage = signal<number>(0);
  isEndList = signal<boolean>(true);
  page = signal<number>(1);
  ngOnInit(): void {
    this.getListMessage();
  }
  closeDialog() {
    this.#dialog.close();
  }
  getListMessage() {
    this.#messageService
      .getListMessageByUser(this.data.userId, this.page())
      .subscribe({
        next: (res) => {
          this.listMessage.set(res.data);
          this.isEndList.set(res.isEndList);
          this.totalMessage.set(res.totalMessage);
        },
        error: (err: HttpErrorResponseType) => {
          this.#toast.openFailToast(err);
          if (err.status === 401) {
            this.#router.navigate(['auth']);
          } else if (err.status === 403 || err.status === 404) {
            this.#router.navigate(['home']);
          }
          this.closeDialog();
        },
      });
  }
  updatePage(isUp: boolean) {
    if (isUp) {
      this.page.update((old) => old + 1);
    } else {
      this.page.update((old) => old - 1);
    }
    this.getListMessage();
  }
  deleteMessage(messageId: string) {
    this.#messageService.deleteMessage(messageId).subscribe({
      next: (res) => {
        this.#toast.openSuccesToast(res.message);
        this.listMessage.update((arrayMessage) =>
          arrayMessage.filter((oldMessage) => oldMessage.id !== messageId),
        );
        this.totalMessage.update((oldValue) => oldValue - 1);
      },
      error: (err: HttpErrorResponseType) => {
        this.#toast.openFailToast(err);
        if (err.status === 401) {
          this.#router.navigate(['auth']);
        } else if (err.status === 403 || err.status === 404) {
          this.#router.navigate(['home']);
        }
      },
    });
  }
}
