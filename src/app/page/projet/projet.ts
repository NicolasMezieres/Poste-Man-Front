import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { DeletePost } from 'src/app/component/modal/delete-post/delete-post';

@Component({
  selector: 'app-projet',
  imports: [MatIcon],
  templateUrl: './projet.html',
  styleUrl: './projet.css',
})
export class Projet {
  constructor(private dialog: MatDialog) {}
  openTest() {
    this.dialog.open(DeletePost, {});
  }
}
