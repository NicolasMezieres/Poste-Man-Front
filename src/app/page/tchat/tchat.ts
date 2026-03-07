import {
  Component,
  inject,
  model,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { HeaderProjectMobileComponent } from 'src/app/component/header/header-project-mobile/header-project-mobile';
import { MatIcon } from '@angular/material/icon';
import { ToastService } from 'src/app/services/toast/toast';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import { IconBackComponent } from 'src/app/component/icon/back/back';
import { MessageService } from 'src/app/services/message/message';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponseType, messageType } from 'src/app/utils/type';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MessageSocketService } from 'src/app/services/message/message-socket';
import { Subscription } from 'rxjs';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IconMoreMessageComponent } from 'src/app/component/icon/more-message/more-message';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { dialogDeleteMessageComponent } from 'src/app/component/modal/message/delete-message/delete-message';
import { IconGroupComponent } from 'src/app/component/icon/group/group';
import { AuthSocketService } from 'src/app/services/auth/auth-socket';
import { buttonGroupMobile } from 'src/app/component/button/button-group-mobile/button.group.mobile';
@Component({
  selector: 'app-tchat',
  imports: [
    HeaderProjectMobileComponent,
    ReactiveFormsModule,
    MatIcon,
    SideBarComponent,
    IconBackComponent,
    ɵInternalFormsSharedModule,
    DatePipe,
    InfiniteScrollDirective,
    MatProgressSpinnerModule,
    MatMenuModule,
    IconMoreMessageComponent,
    IconGroupComponent,
    buttonGroupMobile,
  ],
  templateUrl: './tchat.html',
  styleUrl: './tchat.css',
})
export class TchatComponent implements OnInit, OnDestroy {
  throttleGetMessage = 2000;
  #toast = inject(ToastService);
  #messageService = inject(MessageService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #subscription!: Subscription;
  #socketMessage = inject(MessageSocketService);
  #authSocket = inject(AuthSocketService);
  readonly dialog = inject(MatDialog);
  projectName = signal<string>('');
  projectId = model<string>('');
  messages = signal<messageType[]>([]);
  username = model<string>();
  isModerator = signal<boolean>(false);
  isAdmin = signal<boolean>(false);
  formMessage = new FormGroup({
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
  });
  isLoadingMessage = signal<boolean>(false);
  getMessages() {
    this.#messageService
      .getProjectMessages(this.projectId(), this.messages().length)
      .subscribe({
        next: (res) => {
          this.messages.update((oldValue) => [...oldValue, ...res.data]);
        },
        error: (err: HttpErrorResponseType) => {
          this.#toast.openFailToast(err);
          if (err.status === 401) {
            this.#router.navigate(['auth']);
          } else if (err.status === 404 || err.status === 403) {
            this.#router.navigate(['home']);
          }
        },
      });
    this.isLoadingMessage.update(() => false);
  }
  getProjectName(projectId: string) {
    this.#messageService.getProjectName(projectId).subscribe({
      next: (res) => {
        this.projectName.set(res.projectName);
        this.isModerator.set(res.isModerator);
        this.isAdmin.set(res.isAdmin);
        this.username.set(res.user.username);
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
  ngOnInit() {
    const params = this.#route.snapshot.paramMap.get('projectId');
    if (!params) {
      this.#router.navigate(['']);
      return;
    }
    this.projectId.set(params);
    this.getProjectName(params);
    this.getMessages();
    this.#socketMessage.joinRoom(params);
    this.#authSocket.getProject(params);
    this.#subscription = this.#socketMessage.listenMessage().subscribe({
      next: (data) => {
        switch (data.action) {
          case 'create':
            this.messages.update((messages) => [data.message, ...messages]);
            break;
          case 'delete':
            this.messages.update((messages) =>
              messages.filter((message) => message.id != data.message.id),
            );
            break;
          case 'reset':
            this.messages.update(() => []);
            break;
          case 'ban':
            this.messages.update((messageArray) => {
              return messageArray.map((message) => {
                if (message.user.id === data.userId) {
                  message.isVisible = data.isBanned || false;
                }
                return message;
              });
            });
            break;
          case 'kickUser':
            this.messages.update((messageArray) =>
              messageArray.filter((message) => message.user.id !== data.userId),
            );
            break;
          default:
            break;
        }
      },
    });
  }
  ngOnDestroy() {
    if (this.#subscription) {
      this.#subscription.unsubscribe();
    }
  }
  submitFormMessage(e: Event) {
    e.preventDefault();
    if (this.formMessage.valid) {
      const data = this.formMessage.getRawValue();
      this.#messageService.createMessage(data, this.projectId()).subscribe({
        next: (res) => {
          this.#toast.openSuccesToast(res.message);
          this.formMessage.reset({ message: '' });
        },
        error: (err: HttpErrorResponseType) => {
          this.#toast.openFailToast(err);
          if (err.status === 401) {
            this.#router.navigate(['auth']);
          } else if (err.status === 404) {
            this.#router.navigate(['home']);
          }
        },
      });
    }
  }

  onScroll() {
    this.isLoadingMessage.update(() => true);
    setTimeout(() => {
      this.getMessages();
    }, this.throttleGetMessage);
  }
  submitDeleteMessage(messageId: string) {
    this.#deleteMessage(messageId);
  }
  #deleteMessage(messageId: string) {
    this.#messageService.deleteMessage(messageId).subscribe({
      next: (res) => {
        this.#toast.openSuccesToast(res.message);
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
  openDialogueDeleteAllMessage() {
    this.dialog
      .open(dialogDeleteMessageComponent, {
        data: { isAllMessage: true },
      })
      .afterClosed()
      .subscribe({
        next: (data: { isSubmit: boolean }) => {
          if (data && data.isSubmit) {
            this.#deleteAllMessage();
          }
        },
      });
  }
  #deleteAllMessage() {
    this.#messageService.deleteAllMessage(this.projectId()).subscribe({
      next: (res) => {
        this.#toast.openSuccesToast(res.message);
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
