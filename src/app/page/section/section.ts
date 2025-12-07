import { Component } from '@angular/core';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import { IconBackComponent } from "src/app/component/icon/back/back";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-section',
  imports: [SideBarComponent, IconBackComponent, MatIcon],
  templateUrl: './section.html',
  styleUrl: './section.css',
})
export class SectionComponent {
  projectId = '06d0d448-b154-492e-8d15-0d4c487c496e';
}
