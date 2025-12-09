import { Component, inject, OnInit, signal } from '@angular/core';
import { IconBackComponent } from 'src/app/component/icon/back/back';
import { HeaderProjectMobileComponent } from 'src/app/component/header/header-project-mobile/header-project-mobile';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/post/post';
import { postType } from 'src/app/utils/type';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post',
  imports: [
    IconBackComponent,
    HeaderProjectMobileComponent,
    SideBarComponent,
    MatIcon,
    DatePipe,
  ],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class PostComponent implements OnInit {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #postService = inject(PostService);
  isModerator = signal<boolean>(false);
  isAdmin = signal<boolean>(false);
  username = signal<string>('');
  posts = signal<postType[]>([]);
  projectId = signal<string>('');
  sectionId = signal<string>('');
  zoom = signal<number>(1);
  offsetX = signal<number>(0);
  offsetY = signal<number>(0);
  zoomMore() {
    if (this.zoom() >= 0.2) {
      this.zoom.update((old) => Number((old - 0.1).toFixed(1)));
    }
  }
  zoomLess() {
    if (this.zoom() < 1) {
      this.zoom.update((old) => Number((old + 0.1).toFixed(1)));
    }
  }
  disableZoom() {
    window.addEventListener(
      'wheel',
      (e) => {
        if (e.ctrlKey) {
          e.preventDefault();
        }
      },
      { passive: false },
    );
  }
  moveCard(e: DragEvent) {
    const table = document.querySelector('#table') as HTMLElement;
    const card = document.querySelector('#card1') as HTMLElement;
    const boundingTable = table.getBoundingClientRect();
    const boundingCard = card.getBoundingClientRect();
    if (!card) return;
    console.log(boundingTable.x, boundingTable.width);
    const resultX =
      (e.clientX - boundingCard.width / 2 - boundingTable.x) / this.zoom();
    const resultY = (e.clientY - 30 - boundingTable.y) / this.zoom();
    card.style.left =
      resultX < 0
        ? '0'
        : resultX > (boundingTable.width - boundingCard.width) / this.zoom()
          ? (boundingTable.width - boundingCard.width) / this.zoom() + 'px'
          : resultX + 'px';
    card.style.top =
      resultY < 0
        ? '0'
        : resultY > (boundingTable.height - boundingCard.height) / this.zoom()
          ? (boundingTable.height - boundingCard.height) / this.zoom() + 'px'
          : resultY + 'px';
  }
  testZoomInDiv() {
    const element = document.querySelector('#test') as HTMLElement;
    if (!element) return;
    element.addEventListener('wheel', (e: WheelEvent) => {
      if (e.ctrlKey) {
        if (e.deltaY >= 100) {
          this.zoomMore();
        } else if (e.deltaY <= -100) {
          this.zoomLess();
        }
      }
    });
  }
  ngOnInit() {
    this.disableZoom();
    this.testZoomInDiv();
    //   const paramsProject = this.#route.snapshot.paramMap.get('projectId');
    //   const paramsSection = this.#route.snapshot.paramMap.get('sectionId');
    //   if (!paramsProject || !paramsSection) {
    //     this.#router.navigate(['home']);
    //     return;
    //   }
    //   this.#postService.getPosts(paramsSection).subscribe({
    //     next: (res) => {
    //       this.posts.update(() => res.data);
    //       this.isAdmin.update(() => res.isAdmin);
    //       this.isModerator.update(() => res.isModerator);
    //       this.username.update(() => res.user);
    //     },
    //   });
  }
}
