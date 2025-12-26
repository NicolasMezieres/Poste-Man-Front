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
import { MatDialog } from '@angular/material/dialog';
import { EditPostComponent } from 'src/app/component/modal/post/edit-post/edit-post';
import { DeletePostComponent } from 'src/app/component/modal/post/delete-post/delete-post';
import { TransfertPostComponent } from 'src/app/component/modal/post/transfert-post/transfert-post';

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
  #dialog = inject(MatDialog);
  isModerator = signal<boolean>(false);
  isAdmin = signal<boolean>(false);
  username = signal<string>('');
  posts = signal<postType[]>([]);
  projectId = signal<string>('');
  sectionId = signal<string>('');
  zoom = signal<number>(1);
  sectionName = signal<string>('');
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
  }
  openModalCreatePost() {
    this.#dialog
      .open(EditPostComponent)
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
        this.posts.update((old) => [...old, res.data]);
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
    const post = document.getElementById(postId);
    if (!post) return;
    const poseX = Number(post.style.left.slice(0, -2));
    const poseY = Number(post.style.top.slice(0, -2));
    const data = { text, poseX, poseY };
    this.#postService.updatePost(postId, data).subscribe({
      next: (res) => {
        this.#toast.openSuccesToast(res.message);
        this.posts.update((arrayPost) =>
          arrayPost.map((post) => (post.id === res.data.id ? res.data : post)),
        );
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
        this.posts.update((arrayPost) =>
          arrayPost.filter((post) => post.id != postId),
        );
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
    this.#postService.movePost(postId, sectionId).subscribe({
      next: (res) => {
        this.#toast.openSuccesToast(res.message);
        this.posts.update((arrayPost) =>
          arrayPost.filter((post) => post.id != postId),
        );
        console.log(this.posts());
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
    this.#postService.moveAllPost(this.sectionId(), otherSection).subscribe({
      next: (res) => {
        this.#toast.openSuccesToast(res.message);
        this.posts.update(() => []);
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
        this.posts.update(() => []);
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
}
