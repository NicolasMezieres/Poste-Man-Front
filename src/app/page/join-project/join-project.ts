import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import { ProjectService } from 'src/app/services/project/project';
import { ToastService } from 'src/app/services/toast/toast';
import { HttpErrorResponseType } from 'src/app/utils/type';

@Component({
  selector: 'app-join-project',
  imports: [MatProgressSpinner, SideBarComponent],
  template: `<div class="h-screen w-screen bg-white flex">
    <app-side-bar />
    <main class="flex flex-col flex-1 justify-center items-center gap-20">
      <h1 class="font-Julius text-[32px]">En cours de validation !</h1>
      <mat-spinner [diameter]="150" />
    </main>
  </div> `,
})
export class JoinProjectComponent implements OnInit {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #toast = inject(ToastService);
  #projectService = inject(ProjectService);
  ngOnInit(): void {
    const link = this.#route.snapshot.paramMap.get('linkId');
    if (!link) {
      this.#router.navigate(['home']);
      return;
    }
    this.#projectService.joinProject(link).subscribe({
      next: (res) => {
        this.#toast.openSuccesToast(res.message);
        this.#router.navigate([`/project/${res.projectId}`]);
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
