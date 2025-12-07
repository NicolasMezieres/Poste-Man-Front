import { Component, inject, OnInit, signal } from '@angular/core';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import { IconBackComponent } from 'src/app/component/icon/back/back';
import { MatIcon } from '@angular/material/icon';
import { SectionService } from 'src/app/services/section/section';
import { ToastService } from 'src/app/services/toast/toast';
import { HttpErrorResponseType, sectionType } from 'src/app/utils/type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-section',
  imports: [SideBarComponent, IconBackComponent, MatIcon],
  templateUrl: './section.html',
  styleUrl: './section.css',
})
export class SectionComponent implements OnInit {
  projectId = '06d0d448-b154-492e-8d15-0d4c487c496e';
  #sectionService = inject(SectionService);
  #router = inject(Router);
  #toast = inject(ToastService);
  sections = signal<sectionType[]>([]);
  isModerator = signal<boolean>(false);
  isAdmin = signal<boolean>(false);
  ngOnInit(): void {
    this.#sectionService.getSections(this.projectId).subscribe({
      next: (res) => {
        this.sections.update(() => res.data);
        this.isModerator.update(() => res.isModerator);
        this.isAdmin.update(() => res.isAdmin);
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
