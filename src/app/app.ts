import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthSocketService } from './services/auth/auth-socket';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth/auth-service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatBadgeModule, MatButtonModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('poste-man');
  #authService = inject(AuthService);
  #authSocket = inject(AuthSocketService);
  #router = inject(Router);
  #subscription!: Subscription;
  ngOnInit(): void {
    this.#authService.log().subscribe({
      next: () => {
        const isAdmin = this.#authService.getIsAdmin();
        if (!isAdmin) {
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
        } else {
          console.log('ok');
        }
      },
      error: () => {
        console.log('error');
      },
    });
  }
  ngOnDestroy(): void {
    if (this.#subscription) {
      this.#subscription.unsubscribe();
    }
  }
}
