import { Component } from '@angular/core';
import { IconBackComponent } from "src/app/component/icon/back/back";
import { HeaderProjectMobileComponent } from "src/app/component/header/header-project-mobile/header-project-mobile";
import { SideBarComponent } from "src/app/component/side-bar/side-bar";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-post',
  imports: [IconBackComponent, HeaderProjectMobileComponent, SideBarComponent, MatIcon],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class PostComponent {}
