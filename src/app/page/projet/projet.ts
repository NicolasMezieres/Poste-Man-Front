import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Changement } from 'src/app/component/modal/changement/changement';

@Component({
  selector: 'app-projet',
  imports: [MatIcon],
  templateUrl: './projet.html',
  styleUrl: './projet.css',
})
export class Projet {
  constructor(private dialog: MatDialog) {}
  openTest() {
    this.dialog.open(Changement, {});
  }
}
