import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthSocketService } from './services/auth/auth-socket';
import { UserService } from './services/user/user';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatBadgeModule, MatButtonModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('poste-man');
  #userService = inject(UserService);
  #authSocket = inject(AuthSocketService);
  #router = inject(Router);
  #subscription!: Subscription;
  ngOnInit(): void {
    this.#userService.myAccount().subscribe({
      next: () => {
        this.#authSocket.authSocket();
        this.#subscription = this.#authSocket.listenAuth().subscribe({
          next: (data) => {
            switch (data.type) {
              case 'banned':
                this.#authSocket.deconnection();
                this.#router.navigate(['home']);
                break;
              case 'kicked':
                this.#authSocket.deconnection();
                this.#router.navigate(['home']);
                break;
            }
          },
        });
      },
      error: () => {
        this.#router.navigate(['']);
      },
    });
  }
  ngOnDestroy(): void {
    if (this.#subscription) {
      this.#subscription.unsubscribe();
    }
  }
}
