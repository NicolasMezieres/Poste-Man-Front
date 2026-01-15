import { Component, input, model, OnInit } from '@angular/core';
import { member } from 'src/app/utils/type';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-member',
  imports: [MatIcon],
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
              : ''
        }}"
      ></span>
    </div>
    <p
      class="flex-1 max-w-full text-center wrap-anywhere bg-white py-2.5 rounded-[10px] shadowUnset"
    >
      {{ member().user.username }}
    </p>
    <button
      class="flex"
      aria-label="open dialog option member"
      [hidden]="!isModerator() && !isAdmin()"
    >
      <mat-icon fontIcon="more_horiz" />
    </button>
  </li>`,
})
export class Member implements OnInit {
  member = input.required<member>();
  isModerator = input.required<boolean>();
  isAdmin = input.required<boolean>();
  type = input.required<string>();
  avatar = model<string>('');
  ngOnInit(): void {
    this.avatar.set(`/assets/avatar/${this.member().user.icon}.webp`);
  }
}
