import { Component } from '@angular/core';
import { IconBackComponent } from 'src/app/component/icon/back/back';
import { IconMoreComponent } from 'src/app/component/icon/more/more';

@Component({
  selector: 'app-tchat',
  imports: [IconBackComponent, IconMoreComponent],
  templateUrl: './tchat.html',
  styleUrl: './tchat.css',
})
export class TchatComponent {
  coucou() {
    console.log('coucou');
  }
}
