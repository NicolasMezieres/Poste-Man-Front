import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './services/auth/auth-service';
import { AuthSocketService } from './services/auth/auth-socket';
import { UserService } from './services/user/user';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatBadgeModule, MatButtonModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('poste-man');
  #userService = inject(UserService);
  #authSocket = inject(AuthSocketService);
  #router = inject(Router);
  ngOnInit(): void {
    this.#userService.myAccount().subscribe({
      next: () => {
        this.#authSocket.authSocket();
      },
      error: () => {
        this.#router.navigate(['auth']);
      },
    });
  }
}
