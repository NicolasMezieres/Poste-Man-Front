import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthSocketService } from 'src/app/services/auth/auth-socket';
import { member } from 'src/app/utils/type';
import { MatIcon } from "@angular/material/icon";
import { Member } from "../../member/member";

@Component({
  selector: 'app-list-member',
  imports: [MatIcon, Member],
  templateUrl: './list-member.html',
  styleUrl: './list-member.css',
})
export class ListMemberComponent implements OnInit {
  readonly dialog = inject(MatDialogRef<ListMemberComponent>);
  readonly data = inject<{
    projectId: string;
    isModerator: boolean;
    isAdmin: boolean;
  }>(MAT_DIALOG_DATA);
  #authSocket = inject(AuthSocketService);
  members = signal<member[]>([]);
  closeDialog() {
    this.dialog.close();
  }
  ngOnInit(): void {
    this.#authSocket
      .connectedListMember(this.data.projectId)
      .then((data) => this.members.update(() => data))
      .catch(() => this.closeDialog());
  }
}
