import { Component, inject, input, output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { SideBarComponent } from '../side-bar/side-bar';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [MatIcon, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private dialogRef = inject(MatDialogRef<SideBarComponent>);
  logout = output<void>();
  username = input.required<string>();
  close() {
    this.dialogRef.close();
  }
}
