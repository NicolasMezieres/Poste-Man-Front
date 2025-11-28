import { Component, inject } from '@angular/core';
import { HeaderProjectMobileComponent } from 'src/app/component/header/header-project-mobile/header-project-mobile';
import { IconMoreComponent } from 'src/app/component/icon/more/more';
import { MatIcon } from '@angular/material/icon';
import { ToastService } from 'src/app/services/toast/toast';
import { SideBarComponent } from "src/app/component/side-bar/side-bar";

@Component({
  selector: 'app-tchat',
  imports: [HeaderProjectMobileComponent, IconMoreComponent, MatIcon, SideBarComponent],
  templateUrl: './tchat.html',
  styleUrl: './tchat.css',
})
export class TchatComponent {
  #toast = inject(ToastService);
}
