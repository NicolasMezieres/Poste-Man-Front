import { Component } from '@angular/core';
import { Logo } from 'src/app/component/logo/logo';
import { Footer } from 'src/app/component/footer/footer';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-presentation',
  imports: [Logo, Footer, RouterLink],
  templateUrl: './presentation.html',
  styleUrl: './presentation.css',
})
export class PresentationComponent {}
