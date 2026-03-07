import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { IconBackComponent } from 'src/app/component/icon/back/back';
import { HeaderProjectMobileComponent } from 'src/app/component/header/header-project-mobile/header-project-mobile';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/post/post';
import {
  cardMoveType,
  HttpErrorResponseType,
  postType,
} from 'src/app/utils/type';
import { DatePipe } from '@angular/common';
import { GroundComponent } from 'src/app/component/ground/ground';
import { ToastService } from 'src/app/services/toast/toast';
import { MatDialog } from '@angular/material/dialog';
import { EditPostComponent } from 'src/app/component/modal/post/edit-post/edit-post';
import { DeletePostComponent } from 'src/app/component/modal/post/delete-post/delete-post';
import { TransfertPostComponent } from 'src/app/component/modal/post/transfert-post/transfert-post';
import { PostSocketService } from 'src/app/services/post/post-socket';
import {
  debounceTime,
  groupBy,
  map,
  mergeAll,
  Subject,
  Subscription,
} from 'rxjs';
import { IconGroupComponent } from 'src/app/component/icon/group/group';
import { AuthSocketService } from 'src/app/services/auth/auth-socket';
import { MatMenuModule } from '@angular/material/menu';
import { buttonGroupMobile } from 'src/app/component/button/button-group-mobile/button.group.mobile';
@Component({
  selector: 'app-post',
  imports: [
    IconBackComponent,
    HeaderProjectMobileComponent,
    SideBarComponent,
    MatIcon,
    DatePipe,
    GroundComponent,
    IconGroupComponent,
    MatMenuModule,
    buttonGroupMobile,
  ],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class PostComponent implements OnInit, OnDestroy {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #postService = inject(PostService);
  #toast = inject(ToastService);
  #dialog = inject(MatDialog);
  #postSocket = inject(PostSocketService);
  #subscriptionPost!: Subscription;
  #authSocket = inject(AuthSocketService);
  isModerator = signal<boolean>(false);
  isAdmin = signal<boolean>(false);
  username = signal<string>('');
  posts = signal<postType[]>([]);
  projectId = signal<string>('');
  sectionId = signal<string>('');
  zoom = signal<number>(1);
  sectionName = signal<string>('');
  subjectMoveCard = new Subject<cardMoveType>();
  debounceCard = this.subjectMoveCard
    .pipe(
      groupBy((card) => card.id),
      map((group) => group.pipe(debounceTime(1000))),
      mergeAll(),
    )
    .subscribe((card) => {
      if (!this.isAdmin()) {
        this.#postService
          .movePost(card.id, {
            poseX: card.poseX,
            poseY: card.poseY,
          })
          .subscribe();
      }
    });

  moveCard(e: DragEvent) {
    const table = document.getElementById('table');
    const card = e.target as HTMLElement;
    if (!card || !table) return;
    const boundingTable = table.getBoundingClientRect();
    const boundingCard = card.getBoundingClientRect();
    const resultX =
      (e.clientX - boundingCard.width / 2 - boundingTable.x) / this.zoom();
    const resultY = (e.clientY - 30 - boundingTable.y) / this.zoom();
    const poseX =
      resultX < 0
        ? 0
        : resultX > (boundingTable.width - boundingCard.width) / this.zoom()
          ? (boundingTable.width - boundingCard.width) / this.zoom()
          : resultX;
    card.style.left = poseX + 'px';
    const poseY =
      resultY < 0
        ? 0
        : resultY > (boundingTable.height - boundingCard.height) / this.zoom()
          ? (boundingTable.height - boundingCard.height) / this.zoom()
          : resultY;
    card.style.top = poseY + 'px';
    this.subjectMoveCard.next({
      id: card.id,
      poseX: Number(poseX.toFixed(0)),
      poseY: Number(poseY.toFixed(0)),
    });
  }
  ngOnInit() {
    const paramsProject = this.#route.snapshot.paramMap.get('projectId');
    const paramsSection = this.#route.snapshot.paramMap.get('sectionId');
    if (!paramsProject || !paramsSection) {
      this.#router.navigate(['home']);
      return;
    }
    this.projectId.set(paramsProject);
    this.sectionId.set(paramsSection);
    this.#postService.getPosts(paramsSection).subscribe({
      next: (res) => {
        this.posts.update(() => res.data);
        this.isAdmin.update(() => res.isAdmin);
        this.isModerator.update(() => res.isModerator);
        this.username.update(() => res.user);
        this.sectionName.set(res.sectionName);
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
    if (!this.isAdmin()) {
      this.#postSocket.joinRoom(paramsProject);
      this.#authSocket.getProject(paramsProject);
      this.postSocketSubscription();
    }
  }
  ngOnDestroy() {
    if (this.#subscriptionPost) {
      this.#subscriptionPost.unsubscribe();
    }
  }
  postSocketSubscription() {
    this.#subscriptionPost = this.#postSocket.listenPost().subscribe({
      next: (data) => {
        switch (data.action) {
          case 'create':
            this.posts.update((arrayPost) => [...arrayPost, data.post]);
            break;
          case 'update':
            this.posts.update((arrayPost) =>
              arrayPost.map((post) =>
                post.id === data.post.id ? data.post : post,
              ),
            );
            break;
          case 'delete':
            this.posts.update((arrayPost) =>
              arrayPost.filter((post) => post.id != data.post.id),
            );
            break;
          case 'transfert':
            this.posts.update((arrayPost) =>
              arrayPost.filter((post) => post.id != data.post.id),
            );
            break;
          case 'vote':
            this.posts.update((arrayPost) =>
              arrayPost.map((post) => {
                if (post.id === data.post.id) {
                  post.score = data.post.score;
                }
                return post;
              }),
            );
            break;
          case 'reset':
            this.posts.set([]);
            break;
          case 'postsUpdate':
            this.posts.update((postArray) =>
              postArray.map((post) => {
                if (data.userId === post.user.id) {
                  post.isVisible = data.isBan;
                }
                return post;
              }),
            );
            break;
          case 'kickUser':
            this.posts.update((postArray) =>
              postArray.filter((post) => post.user.id !== data.userId),
            );
            break;
        }
      },
    });
  }
  openModalCreatePost() {
    this.#dialog
      .open(EditPostComponent, { data: { text: '' } })
      .afterClosed()
      .subscribe({
        next: (data: { isSubmit: boolean; text: string }) => {
          if (data && data.isSubmit) {
            this.#createPost(data.text);
          }
        },
      });
  }
  #createPost(text: string) {
    const { poseX, poseY } = this.getPosition();
    const data = { text, poseX, poseY };
    this.#postService.createPost(this.sectionId(), data).subscribe({
      next: (res) => {
        this.#toast.openSuccesToast(res.message);
      },
      error: (err: HttpErrorResponseType) => {
        this.#toast.openFailToast(err);
        if (err.status == 401) {
          this.#router.navigate(['auth']);
        } else if (err.status === 403 || err.status === 404) {
          this.#router.navigate(['home']);
        }
      },
    });
  }

  getPosition(): { poseX: number; poseY: number } {
    const ground = document.getElementById('ground');
    const table = document.getElementById('table');
    if (!table || !ground) return { poseX: 0, poseY: 0 };
    const boundingTable = table.getBoundingClientRect();
    const boundingGround = ground.getBoundingClientRect();
    const poseX = Math.round(
      (boundingGround.width / 2 - boundingTable.x) / this.zoom(),
    );
    const poseY = Math.round(
      (boundingGround.height / 2 - boundingTable.y) / this.zoom(),
    );
    return { poseX, poseY };
  }
  openModalUpdatePost(post: postType) {
    this.#dialog
      .open(EditPostComponent, { data: { text: post.text } })
      .afterClosed()
      .subscribe({
        next: (data: { isSubmit: boolean; text: string }) => {
          if (data && data.isSubmit) {
            this.#updatePost(data.text, post.id);
          }
        },
      });
  }
  #updatePost(text: string, postId: string) {
    const data = { text };
    this.#postService.updatePost(postId, data).subscribe({
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

  openModalDeletePost(post: postType) {
    this.#dialog
      .open(DeletePostComponent, { data: { post } })
      .afterClosed()
      .subscribe({
        next: (data: { isSubmit: boolean }) => {
          if (data && data.isSubmit) {
            this.#deletePost(post.id);
          }
        },
      });
  }
  #deletePost(postId: string) {
    this.#postService.delete(postId).subscribe({
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
  openModalTransfertPost(post: postType) {
    this.#dialog
      .open(TransfertPostComponent, {
        data: {
          post,
          projectId: this.projectId(),
          sectionId: this.sectionId(),
        },
      })
      .afterClosed()
      .subscribe({
        next: (data: { isSubmit: boolean; sectionId: string }) => {
          if (data && data.isSubmit) {
            this.#transfertPost(post.id, data.sectionId);
          }
        },
      });
  }
  #transfertPost(postId: string, sectionId: string) {
    this.#postService.transfertPost(postId, sectionId).subscribe({
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
  openModalTransfertAllPost() {
    this.#dialog
      .open(TransfertPostComponent, {
        data: {
          isAllPost: true,
          projectId: this.projectId(),
          sectionId: this.sectionId(),
        },
      })
      .afterClosed()
      .subscribe({
        next: (data: { isSubmit: boolean; sectionId: string }) => {
          if (data && data.isSubmit) {
            this.#transfertAllPost(data.sectionId);
          }
        },
      });
  }
  #transfertAllPost(otherSection: string) {
    this.#postService
      .transfertAllPost(this.sectionId(), otherSection)
      .subscribe({
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
  openModalDeleteAllPost() {
    this.#dialog
      .open(DeletePostComponent, { data: { isAllPost: true } })
      .afterClosed()
      .subscribe({
        next: (data: { isSubmit: boolean }) => {
          if (data && data.isSubmit) {
            this.#deleteAllPost();
          }
        },
      });
  }
  #deleteAllPost() {
    this.#postService.deleteAll(this.sectionId()).subscribe({
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
  submitVote(isUp: boolean, postId: string) {
    this.#postService.vote(postId, { isUp }).subscribe({
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
