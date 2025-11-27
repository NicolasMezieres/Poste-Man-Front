import { Component } from '@angular/core';
import { IconBackComponent } from 'src/app/component/icon/back/back';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-tchat',
  imports: [IconBackComponent, MatIcon],
  templateUrl: './tchat.html',
  styleUrl: './tchat.css',
})
export class TchatComponent {}
