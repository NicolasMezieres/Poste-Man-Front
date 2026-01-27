import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IconHelpComponent } from 'src/app/component/icon/help/help';
import { DialogHelps } from 'src/app/component/modal/dialog-help/dialog-help';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';

@Component({
  selector: 'app-home',
  imports: [SideBarComponent, IconHelpComponent],
  templateUrl: './home.html',
})
export class HomeComponent {
  private readonly dialogRef = inject(MatDialog);
  openHelp() {
    this.dialogRef.open(DialogHelps, {
      data: { screen: 'HelpMenu' },
      minWidth: 375,
      panelClass: 'dialog-rectangle',
    });
  }
}
