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
    });
  }
}
