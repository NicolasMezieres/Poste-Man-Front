import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  HttpErrorResponseType,
  postType,
  sectionType,
} from 'src/app/utils/type';
import { MatIcon } from '@angular/material/icon';
import { CardPostComponent } from 'src/app/component/card/post/post';
import { SectionService } from 'src/app/services/section/section';
import { ToastService } from 'src/app/services/toast/toast';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonActionComponent } from 'src/app/component/button/button-action/button-action';

@Component({
  selector: 'app-transfert-post',
  imports: [
    MatIcon,
    CardPostComponent,
    ReactiveFormsModule,
    ButtonActionComponent,
  ],
  templateUrl: './transfert-post.html',
})
export class TransfertPostComponent implements OnInit {
  private readonly dialog = inject(MatDialogRef<TransfertPostComponent>);
  readonly data = inject<{
    post: postType;
    isAllPost: boolean;
    projectId: string;
    sectionId: string;
  }>(MAT_DIALOG_DATA);
  #sectionService = inject(SectionService);
  #toast = inject(ToastService);
  #router = inject(Router);
  sections = signal<sectionType[]>([]);
  formMovePost = new FormGroup({
    sectionId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  ngOnInit(): void {
    if (
      !this.data.projectId ||
      !this.data.sectionId ||
      (!this.data.post && !this.data.isAllPost)
    ) {
      this.#router.navigate(['home']);
      this.closeDialog();
      return;
    }
    this.#sectionService.getSections(this.data.projectId).subscribe({
      next: (res) => {
        this.sections.set(res.data);
        res.data.map((section) => {
          if (section.id === this.data.sectionId) {
            this.formMovePost.setValue({ sectionId: this.data.sectionId });
          }
        });
      },
      error: (err: HttpErrorResponseType) => {
        this.#toast.openFailToast(err);
        if (err.status === 401) {
          this.#router.navigate(['auth']);
        } else if (err.status === 403 || err.status === 404) {
          this.#router.navigate(['home']);
        }
        this.closeDialog();
      },
    });
  }
  closeDialog() {
    this.dialog.close();
  }
  submitTransfertPost() {
    if (this.formMovePost.valid) {
      const data = this.formMovePost.getRawValue();
      this.dialog.close({ isSubmit: true, ...data });
    }
  }
}
