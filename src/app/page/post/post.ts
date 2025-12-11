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
  previousScrollX = signal<number>(0);
  previousScrollY = signal<number>(0);
  //todo regarder si canva peut faire le zoom
  //todo changer le minimum zoom par
  // si main.width est plus grand que table.width alors on zoom pas
  // si table width plus grand que que main width * (this.zoom() -0.1)
  // && this.zoom() supérieur à 0.1 alors on zoom
  zoomMore() {
    if (this.zoom() >= 0.4) {
      this.zoom.update((old) => Number((old - 0.1).toFixed(1)));
    }
  }
  zoomLess() {
    if (this.zoom() < 1) {
      this.zoom.update((old) => Number((old + 0.1).toFixed(1)));
    }
  }
  scroll(e: MouseEvent) {
    const main = document.querySelector('main');
    const table = document.querySelector('#table');
    if (!main || !table) return;
    const boundingTable = table.getBoundingClientRect();
    const boundingMain = main.getBoundingClientRect();
    //je pense qu'il manque juste à trouver la taille de table sur l'écran
    // genre 1500 étant donner qu'on trouve 500
    // console.log(boundingMain.width, main.scrollLeft);
    console.log(
      e.offsetX,
      boundingMain,
      e.clientX,
      main.scrollLeft,
      this.zoom(),
    );
    //   boundingTable.width,
    //   boundingTable,
  }
  //todo: ff le zoom;
  //todo: par contre se déplacer avec le clic droit de la souris serait pas mal
  //todo: essayer le déplacer en tenant une card et se déplacer  à gauche ou autre
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
    const card = e.target as HTMLElement;
    const boundingTable = table.getBoundingClientRect();
    const boundingCard = card.getBoundingClientRect();
    if (!card) return;
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
    const main = document.querySelector('main');
    const table = document.getElementById('table');
    if (!table || !main) return;
    main.addEventListener('wheel', (e: WheelEvent) => {
      if (e.ctrlKey) {
        // if (e.deltaY >= 100) {
        //   this.zoomMore();
        // } else if (e.deltaY <= -100) {
        //   this.zoomLess();
        // }
        if (e.deltaY) {
          this.updateZooming(e);
        }
      }
    });
  }
  updateZooming(e: WheelEvent) {
    const main = document.querySelector('main');
    const table = document.getElementById('table');
    if (!main || !table) return;
    const oldScale = this.zoom();
    const oldX = this.originX();
    const oldY = this.originY();

    const boundingMain = main.getBoundingClientRect();
    const boundingTable = table.getBoundingClientRect();
    const localX = e.clientX - boundingMain.left + main.scrollLeft;
    // const localX =
    //   calculX < boundingMain.width
    //     ? 0
    //     : calculX > boundingTable.width - boundingMain.width
    //       ? boundingTable.width - boundingMain.width
    //       : calculX;
    // console.log(
    //   calculX > boundingTable.width,
    //   boundingTable.width / oldScale,
    //   boundingMain.width,
    //   localX,
    // );
    const localY = e.clientY - boundingMain.top + main.scrollTop;
    // const localY = calculY > boundingMain.height ? calculY : 0;
    const previousScale = this.zoom();
    const newScale = Math.min(
      1,
      Math.max(0.3, this.zoom() + e.deltaY * -0.001),
    );
    let newX = localX - (localX - oldX) * (newScale / previousScale);
    let newY = localY - (localY - oldY) * (newScale / previousScale);
    const visibleWidth = main.clientWidth;
    const visibleHeight = main.clientHeight;

    const contentWidth = 5000 * newScale;
    const contentHeight = 5000 * newScale;

    const minX = visibleWidth - contentWidth;
    let maxX = 0;

    const minY = visibleHeight - contentHeight;
    let maxY = 0;
    newX = Math.min(0, Math.max(minX, newX));
    newY = Math.min(0, Math.max(minY, newY));
    this.originX.update(() => newX);
    this.originY.update(() => newY);
    this.zoom.update(() => newScale);
  }
  toggleMove(value: boolean, e: PointerEvent) {
    this.cursorX.update(() => e.clientX);
    this.cursorY.update(() => e.clientY);
    this.isMovable.update(() => value);
    const main = document.querySelector('main');
    if (!main) return;
    this.previousScrollX.update(() => main.scrollLeft);
    this.previousScrollY.update(() => main.scrollTop);
  }
  move(e: MouseEvent) {
    if (this.isMovable()) {
      const main = document.querySelector('main');
      if (!main) return;
      console.log(main.scrollLeft, this.cursorY(), e.clientY);
      main.scrollLeft = this.previousScrollX() + this.cursorX() - e.clientX;
      main.scrollTop = this.previousScrollY() + this.cursorY() - e.clientY;
    }
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
