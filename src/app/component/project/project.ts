import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-project',
  imports: [MatIcon],
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class Project {
  // #projectService = inject(Project)
}
