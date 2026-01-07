import { Component, inject, output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { SideBarComponent } from '../side-bar/side-bar';

@Component({
  selector: 'app-header',
  imports: [MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private dialogRef = inject(MatDialogRef<SideBarComponent>);
  logout = output<void>();
  close() {
    this.dialogRef.close();
  }
}
