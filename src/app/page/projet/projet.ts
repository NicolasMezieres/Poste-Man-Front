import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { SideBar } from 'src/app/component/side-bar/side-bar';

@Component({
  selector: 'app-projet',
  imports: [MatIcon],
  templateUrl: './projet.html',
  styleUrl: './projet.css',
})
export class Projet {
  constructor(private dialog: MatDialog) {}
  openSideBar() {
    this.dialog.open(SideBar, {});
  }
}
