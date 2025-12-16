import { Component } from '@angular/core';
import { SideBarComponent } from "src/app/component/side-bar/side-bar";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-project',
  imports: [SideBarComponent, RouterLink],
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class ProjectComponent {

}
