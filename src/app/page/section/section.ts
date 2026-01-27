import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { IconBackComponent } from 'src/app/component/icon/back/back';
import { IconGroupComponent } from 'src/app/component/icon/group/group';
import { IconHelpComponent } from 'src/app/component/icon/help/help';
import { DialogHelps } from 'src/app/component/modal/dialog-help/dialog-help';
import { FormSectionComponent } from 'src/app/component/modal/section/create-section/form-section';
import { DeleteSectionComponent } from 'src/app/component/modal/section/delete-section/delete-section';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import { AuthSocketService } from 'src/app/services/auth/auth-socket';
import { SectionService } from 'src/app/services/section/section';
import { ToastService } from 'src/app/services/toast/toast';
import { HttpErrorResponseType, sectionType } from 'src/app/utils/type';

@Component({
  selector: 'app-section',
  imports: [
    SideBarComponent,
    IconBackComponent,
    MatIcon,
    RouterLink,
    IconGroupComponent,
    IconHelpComponent,
  ],
  templateUrl: './section.html',
  styleUrl: './section.css',
})
export class SectionComponent implements OnInit {
  private readonly dialogRef = inject(MatDialog);
  #sectionService = inject(SectionService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #toast = inject(ToastService);
  #dialog = inject(MatDialog);
  #authSocket = inject(AuthSocketService);
  sections = signal<sectionType[]>([]);
  isModerator = signal<boolean>(false);
  isAdmin = signal<boolean>(false);
  projectId = signal<string>('');
  isVisible = signal<boolean>(false);
  projectName = signal<string>('');

  ngOnInit(): void {
    const params = this.#route.snapshot.paramMap.get('projectId');
    if (!params) {
      this.#router.navigate(['home']);
      return;
    }

    this.projectId.update(() => params);
    this.#sectionService
      .getSections(params)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.sections.update(() => res.data);
          this.isModerator.update(() => res.isModerator);
          this.isAdmin.update(() => res.isAdmin);
          this.projectName.set(res.projectName);
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
    this.#authSocket.getProject(this.projectId());
  }
  toggleVisible() {
    this.isVisible.update((old) => !old);
  }
  openModalCreateSection() {
    this.#dialog
      .open(FormSectionComponent)
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
        this.#toast.openSuccesToast(res.message);
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
  openModalEditSection(name: string, sectionId: string) {
    this.#dialog
      .open(FormSectionComponent, { data: { name } })
      .afterClosed()
      .subscribe({
        next: (data: { name: string }) => {
          if (data && data.name) {
            this.#editSection(data.name, sectionId);
          }
        },
      });
  }
  #editSection(name: string, sectionId: string) {
    const data = { name };
    this.#sectionService
      .updateSection(data, sectionId, this.projectId())
      .subscribe({
        next: (res) => {
          this.#toast.openSuccesToast(res.message);
          this.sections.update((oldData) =>
            oldData.map((section) =>
              section.id === sectionId
                ? { ...section, name: res.data.name }
                : section,
            ),
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
  openModalDeleteSection(sectionId: string, sectionName: string) {
    this.#dialog
      .open(DeleteSectionComponent, {
        data: { title: sectionName, isAllSection: false },
      })
      .afterClosed()
      .subscribe({
        next: (data: { isSubmit: boolean }) => {
          if (data && data.isSubmit) {
            this.#deleteSection(sectionId);
          }
        },
      });
  }
  #deleteSection(sectionId: string) {
    this.#sectionService.removeSection(sectionId).subscribe({
      next: (res) => {
        this.#toast.openSuccesToast(res.message);
        this.sections.update((data) =>
          data.filter((section) => section.id != sectionId),
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
  openModalRemoveAllSection() {
    this.#dialog
      .open(DeleteSectionComponent, {
        data: { title: this.projectName(), isAllSection: true },
      })
      .afterClosed()
      .subscribe({
        next: (data: { isSubmit: boolean }) => {
          if (data && data.isSubmit) {
            this.#removeAllSection();
          }
        },
      });
  }
  #removeAllSection() {
    this.#sectionService.removeAllSection(this.projectId()).subscribe({
      next: (res) => {
        this.#toast.openSuccesToast(res.message);
        this.sections.update(() => []);
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

  openHelp() {
    if (this.isModerator()) {
      this.dialogRef.open(DialogHelps, {
        data: { screen: 'HelpSectionModo' },
        minWidth: 375,
        panelClass: 'dialog-rectangle',
      });
    } else {
      this.dialogRef.open(DialogHelps, {
        data: { screen: 'HelpSection' },
        minWidth: 375,
        panelClass: 'dialog-rectangle',
      });
    }
  }
}
