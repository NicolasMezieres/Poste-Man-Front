import { Component, inject, OnInit, signal } from '@angular/core';
import { SideBarComponent } from 'src/app/component/side-bar/side-bar';
import { AuthService } from 'src/app/services/auth/auth-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [SideBarComponent, RouterLink],
  templateUrl: './home.html',
})
export class HomeComponent implements OnInit {
  #authService = inject(AuthService);
  isAdmin = signal<boolean>(false);
  ngOnInit(): void {
    this.#authService.log().subscribe({
      next: (res) => {
        this.isAdmin.set(res.isAdmin);
      },
    });
  }
}
