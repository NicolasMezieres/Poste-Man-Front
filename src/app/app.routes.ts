import { Routes } from '@angular/router';
import { PresentationComponent } from './page/presentation/presentation';
import { AuthComponent } from './page/auth/auth';

export const routes: Routes = [
  { path: '', component: PresentationComponent },
  { path: 'auth', component: AuthComponent },
];

