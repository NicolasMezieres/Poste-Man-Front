import { Component, inject, OnInit, signal } from '@angular/core';
import { IconBackComponent } from 'src/app/component/icon/back/back';
import { HeaderProjectMobileComponent } from 'src/app/component/header/header-project-mobile/header-project-mobile';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/post/post';
import { HttpErrorResponseType, postType } from 'src/app/utils/type';
import { DatePipe } from '@angular/common';
import { GroundComponent } from 'src/app/component/ground/ground';
import { ToastService } from 'src/app/services/toast/toast';

@Component({
  selector: 'app-post',
  imports: [
    IconBackComponent,
    HeaderProjectMobileComponent,
    SideBarComponent,
    MatIcon,
    DatePipe,
    GroundComponent,
  ],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class PostComponent implements OnInit {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #postService = inject(PostService);
  #toast = inject(ToastService);
  isModerator = signal<boolean>(false);
  isAdmin = signal<boolean>(false);
  username = signal<string>('');
  posts = signal<postType[]>([]);
  projectId = signal<string>('');
  sectionId = signal<string>('');
  zoom = signal<number>(1);
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
  //todo: essayer le déplacer en tenant une card et se déplacer  à gauche ou autre
  ngOnInit() {
    const paramsProject = this.#route.snapshot.paramMap.get('projectId');
    const paramsSection = this.#route.snapshot.paramMap.get('sectionId');
    if (!paramsProject || !paramsSection) {
      this.#router.navigate(['home']);
      return;
    }
    this.#postService.getPosts(paramsSection).subscribe({
      next: (res) => {
        this.posts.update(() => res.data);
        this.isAdmin.update(() => res.isAdmin);
        this.isModerator.update(() => res.isModerator);
        this.username.update(() => res.user);
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
}
