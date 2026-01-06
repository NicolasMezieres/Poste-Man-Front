import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SideBarComponent } from '../side-bar/side-bar';

@Component({
  selector: 'app-header',
  imports: [MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header{
 
  private dialogRef = inject(MatDialogRef<SideBarComponent>);
  private router = inject(Router);

  close() {
    this.dialogRef.close();
  }
  goToProfile() {
    this.dialogRef.close();
    this.router.navigate(['/profil']);
  }
  logout() {}
}
