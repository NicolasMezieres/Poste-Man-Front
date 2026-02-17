import { Component, inject, input, model, OnInit, output } from '@angular/core';
import { member } from 'src/app/utils/type';
import { MenuMemberComponent } from '../icon/menu-member/menu-member';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-member',
  imports: [MenuMemberComponent],
  template: `<li class="flex items-center gap-2.5">
    <div class="relative">
      <img
        class="w-12 h-12 rounded-[50%] border bg-white"
        [alt]="'avatar ' + member().user.icon"
        [src]="avatar()"
        (error)="avatar.set('/assets/posteman.webp')"
      />
      <span
        class="absolute border rounded-[50%] bottom-0 right-2 w-4 h-4 {{
          type() === 'online'
            ? 'bg-green-500'
            : type() === 'offline'
              ? 'bg-gray-500'
              : 'border-none'
        }}"
      ></span>
    </div>
    <p
      class="flex-1 max-w-full text-center wrap-anywhere bg-white py-2.5 rounded-[10px] shadowUnset"
    >
      {{ member().user.username }}
    </p>
    <app-menu-member
      (kickUser)="kickUser.emit()"
      (banUser)="banUser.emit()"
      [hidden]="!isModerator()"
      [isBan]="member().isBanned"
    />
  </li>`,
})
export class Member implements OnInit {
  readonly dialog = inject(MatDialog);
  member = input.required<member>();
  isModerator = input.required<boolean>();
  isAdmin = input.required<boolean>();
  type = input.required<string>();
  kickUser = output<void>();
  banUser = output<void>();
  avatar = model<string>('');

  ngOnInit(): void {
    this.avatar.set(`/assets/avatar/${this.member().user.icon}.webp`);
  }
}
