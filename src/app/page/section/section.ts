import { Component, inject, OnInit, signal } from '@angular/core';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import { IconBackComponent } from 'src/app/component/icon/back/back';
import { MatIcon } from '@angular/material/icon';
import { SectionService } from 'src/app/services/section/section';
import { ToastService } from 'src/app/services/toast/toast';
import { HttpErrorResponseType, sectionType } from 'src/app/utils/type';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormSectionnComponent } from 'src/app/component/modal/section/form-section/form-section';

@Component({
  selector: 'app-section',
  imports: [SideBarComponent, IconBackComponent, MatIcon, RouterLink],
  templateUrl: './section.html',
  styleUrl: './section.css',
})
export class SectionComponent implements OnInit {
  #sectionService = inject(SectionService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #toast = inject(ToastService);
  #dialog = inject(MatDialog);
  sections = signal<sectionType[]>([]);
  isModerator = signal<boolean>(false);
  isAdmin = signal<boolean>(false);
  projectId = signal<string>('');
  isVisible = signal<boolean>(false);
  ngOnInit(): void {
    const params = this.#route.snapshot.paramMap.get('projectId');
    if (!params) {
      this.#router.navigate(['home']);
      return;
    }
    this.projectId.update(() => params);
    this.#sectionService.getSections(params).subscribe({
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
  toggleVisible() {
    this.isVisible.update((old) => !old);
  }
  openModalCreateSection() {
    this.#dialog
      .open(FormSectionnComponent)
      .afterClosed()
      .subscribe({
        next: (data: { name: string }) => {
          if (data && data.name) {
            this.#createSection(data.name);
          }
        },
      });
  }
  #createSection(name: string) {
    const data = { name };
    this.#sectionService.createSection(data, this.projectId()).subscribe({
      next: (res) => {
        this.#toast.succesToast(res.message);
        this.sections.update((oldData) => [...oldData, res.data]);
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
