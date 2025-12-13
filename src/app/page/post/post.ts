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
  originX = signal<number>(0);
  originY = signal<number>(0);
  isMovable = signal<boolean>(false);
  cursorX = signal<number>(0);
  cursorY = signal<number>(0);
  previousCursorX = signal<number>(0);
  previousCursorY = signal<number>(0);
  //todo: essayer le déplacer en tenant une card et se déplacer  à gauche ou autre
  //todo changer le minimum zoom par
  // si main.width est plus grand que table.width alors on zoom pas
  // si table width plus grand que que main width * (this.zoom() -0.1)
  // && this.zoom() supérieur à 0.1 alors on zoom
  initPage() {
    window.addEventListener(
      'wheel',
      (e) => {
        if (e.ctrlKey) {
          e.preventDefault();
        }
      },
      { passive: false },
    );
    document.addEventListener('dragend', () => {
      this.isMovable.update(() => false);
    });
  }

  detectZoom() {
    const main = document.querySelector('main');
    const table = document.getElementById('table');
    if (!table || !main) return;
    main.addEventListener('wheel', (e: WheelEvent) => {
      if (e.ctrlKey) {
        if (e.deltaY) {
          this.updateZooming(e);
        }
      }
    });
  }
  moveCard(e: DragEvent) {
    const table = document.getElementById('table');
    const card = e.target as HTMLElement;
    if (!card || !table) return;
    const boundingTable = table.getBoundingClientRect();
    const boundingCard = card.getBoundingClientRect();
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
  updateZooming(e: WheelEvent) {
    const main = document.querySelector('main');
    const table = document.getElementById('table');
    if (!main || !table) return;
    const boundingMain = main.getBoundingClientRect();
    const boundingTable = table.getBoundingClientRect();
    const cursorX = e.clientX - boundingMain.x;
    const posX = cursorX - this.originX();
    const cursorY = e.clientY - boundingMain.y;
    const posY = cursorY - this.originY();
    const oldZoom = this.zoom();
    const viewportWidth = boundingMain.width;
    const viewportHeight = boundingMain.height;
    if (e.deltaY > 0) {
      if (
        viewportWidth - (boundingTable.width / oldZoom) * (this.zoom() - 0.1) <
          0 &&
        viewportHeight -
          (boundingTable.height / oldZoom) * (this.zoom() - 0.1) <
          0
      ) {
        this.zoom.update((old) => Number((old - 0.1).toFixed(1)));
      }
    } else if (e.deltaY < 0 && this.zoom() < 1) {
      this.zoom.update((old) => Number((old + 0.1).toFixed(1)));
    }
    const newOriginX = (posX / oldZoom) * this.zoom();
    const newPosX = cursorX - newOriginX;
    const newOriginY = (posY / oldZoom) * this.zoom();
    const newPosY = cursorY - newOriginY;

    const totalWidth = (boundingTable.width / oldZoom) * this.zoom();
    const totalHeight = (boundingTable.height / oldZoom) * this.zoom();
    const minX = viewportWidth - totalWidth;
    const minY = viewportHeight - totalHeight;
    const newX = Math.min(0, Math.max(minX, newPosX));
    const newY = Math.min(0, Math.max(minY, newPosY));
    this.originX.update(() => newX);
    this.originY.update(() => newY);
  }
  toggleMove(value: boolean, e: PointerEvent) {
    this.cursorX.update(() => e.clientX);
    this.cursorY.update(() => e.clientY);
    this.isMovable.update(() => value);
    const main = document.querySelector('main');
    if (!main) return;
    this.previousCursorX.update(() => this.originX());
    this.previousCursorY.update(() => this.originY());
  }
  move(e: MouseEvent) {
    if (this.isMovable()) {
      const posX = e.clientX - this.cursorX() + this.previousCursorX();
      const posY = e.clientY - this.cursorY() + this.previousCursorY();
      const main = document.querySelector('main');
      const table = document.getElementById('table');
      if (!main || !table) return;
      const boundingMain = main.getBoundingClientRect();
      const boundingTable = table.getBoundingClientRect();
      const viewportWidth = boundingMain.width;
      const viewportHeight = boundingMain.height;
      const totalWidth = boundingTable.width;
      const totalHeight = boundingTable.height;
      const minX = viewportWidth - totalWidth;
      const minY = viewportHeight - totalHeight;
      this.originX.update(() => Math.min(0, Math.max(minX, posX)));
      this.originY.update(() => Math.min(0, Math.max(minY, posY)));
    }
  }
  ngOnInit() {
    this.initPage();
    this.detectZoom();
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
