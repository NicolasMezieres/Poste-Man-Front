import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePost } from 'src/app/component/modal/create-post/create-post';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-projet',
  imports: [MatIcon],
  templateUrl: './projet.html',
  styleUrl: './projet.css',
})
export class Projet {
  constructor(private dialog: MatDialog) {}
  openTest() {
    this.dialog.open(CreatePost, {
      position: { right: '0' },
    });
  }
}
