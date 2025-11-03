import { Component } from '@angular/core';
import { Logo } from '../../component/logo/logo';
import { Footer } from '../../component/footer/footer';

@Component({
  selector: 'app-presentation',
  imports: [Logo, Footer],
  templateUrl: './presentation.html',
  styleUrl: './presentation.css',
})
export class PresentationComponent {}
