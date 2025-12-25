import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { postType } from 'src/app/utils/type';

@Component({
  selector: 'app-card-post',
  imports: [MatIcon, DatePipe],
  template: `<article class="w-72 flex flex-col overflow-y-auto">
    <header
      class="flex justify-between bg-purple text-white border border-black rounded-t-[5px] px-5 py-2"
    >
      <div class="flex items-center gap-2.5">
        <button aria-label="upVote" class="flex items-center">
          <mat-icon fontIcon="arrow_upward" class="arrowIcon" />
        </button>
        <span class="text-xl">{{ post().score }}</span>
        <button aria-label="downVote" class="flex items-center">
          <mat-icon fontIcon="arrow_downward" class="arrowIcon" />
        </button>
      </div>
      <h2 class="text-2xl wrap-anywhere text-center">
        {{ post().user.username }}
      </h2>
    </header>
    <p
      class="text-xl flex-1 p-2 border rounded-b-[5px] bg-white disabled:bg-white whitespace-pre-line"
    >
      {{ post().text }}
    </p>
    <time datetime="01/01/1111 01:01" class="text-end text-xl py-2.5"
      >{{ post().createdAt | date: 'dd/MM/yyyy HH:mm' }}
    </time>
  </article>`,
})
export class CardPostComponent {
  post = input.required<postType>();
}
