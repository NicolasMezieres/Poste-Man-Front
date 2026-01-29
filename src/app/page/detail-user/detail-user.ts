import { Component, inject, model, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user';
import { detailUserType } from 'src/app/utils/type';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import { IconBackComponent } from 'src/app/component/icon/back/back';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ListProjectComponent } from 'src/app/component/modal/list-project/list-project';

@Component({
  selector: 'app-detail-user',
  imports: [SideBarComponent, IconBackComponent, DatePipe],
  templateUrl: './detail-user.html',
  styleUrl: './detail-user.css',
})
export class DetailUserPage implements OnInit {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #userService = inject(UserService);
  #dialog = inject(MatDialog);
  userId = signal<string>('');
  detailUser = model<detailUserType>();
  ngOnInit(): void {
    const params = this.#route.snapshot.paramMap.get('userId');
    if (!params) {
      this.#router.navigate(['home']);
      return;
    }
    this.userId.set(params);
    this.#userService.getUser(params).subscribe({
      next: (res) => {
        this.detailUser.set(res.data);
      },
    });
  }
  openModalListProject() {
    this.#dialog.open(ListProjectComponent, {
      data: { userId: this.userId(), username: this.detailUser()?.username },
      minWidth: '100vw',
      panelClass: 'dialog-rectangle',
    });
  }
  openModalListMessage() {}
  openModalBanUser() {}
  openModalDeleteUser() {}
}
