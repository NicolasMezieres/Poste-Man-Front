import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { SideBar } from '../side-bar/side-bar';

@Component({
  selector: 'app-header',
  imports: [MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(private dialogRef: MatDialogRef<SideBar>) {}

  close() {
    this.dialogRef.close();
  }
}
