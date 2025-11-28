import { Component, inject, model, signal } from '@angular/core';
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
export class TchatComponent {
  #toast = inject(ToastService);
  #message = inject(MessageService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  projectId = model<string>();
  messages = model<messageType[]>();
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
        this.messages.update(() => res.data);
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
  }
  submitFormMessage(e: Event) {
    e.preventDefault();
  }
}
