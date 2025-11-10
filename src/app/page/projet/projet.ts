import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Footer } from 'src/app/component/footer/footer';
import { Header } from 'src/app/component/header/header';
import { SideBar } from 'src/app/component/side-bar/side-bar';

@Component({
  selector: 'app-projet',
  imports: [Footer, Header, MatIcon],
  templateUrl: './projet.html',
  styleUrl: './projet.css',
})
export class Projet {
  constructor(private dialog: MatDialog) {}
  openSideBar() {
    this.dialog.open(SideBar, {});
  }
}
