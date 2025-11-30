import {
  Component,
  inject,
  model,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { HeaderProjectMobileComponent } from 'src/app/component/header/header-project-mobile/header-project-mobile';
import { IconMoreComponent } from 'src/app/component/icon/more/more';
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

@Component({
  selector: 'app-tchat',
  imports: [
    HeaderProjectMobileComponent,
    IconMoreComponent,
    ReactiveFormsModule,
    MatIcon,
    SideBarComponent,
    IconBackComponent,
    ɵInternalFormsSharedModule,
    DatePipe,
  ],
  templateUrl: './tchat.html',
  styleUrl: './tchat.css',
})
export class TchatComponent implements OnInit, OnDestroy {
  #toast = inject(ToastService);
  #message = inject(MessageService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #subscription!: Subscription;
  #socketMessage = inject(MessageSocketService);
  projectId = model<string>('');
  messages = model<messageType[]>([]);
  username = model<string>();
  isModerator = signal<boolean>(false);
  formMessage = new FormGroup({
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
  });
  ngOnInit() {
    const params = this.#route.snapshot.paramMap.get('projectId');
    if (!params) {
      this.#router.navigate(['']);
      return;
    }
    this.projectId.set(params);
    this.#message.getProjectMessages(params).subscribe({
      next: (res) => {
        console.log(res);
        this.messages.set(res.data);
        this.username.update(() => res.user);
        this.isModerator.update(() => res.isModerator);
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
    this.#socketMessage.joinRoom(params);
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
          default:
            break;
        }
      },
      error: (err) => {
        console.log(err);
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
      this.#message.createMessage(data, this.projectId()).subscribe({
        next: (res) => {
          this.#toast.openSuccesToast(res.message);
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
}
