import { Routes } from '@angular/router';
import { AuthComponent } from './page/auth/auth';
import { PresentationComponent } from './page/presentation/presentation';
import { Projet } from './page/projet/projet';

export const routes: Routes = [
  { path: '', component: PresentationComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'projet', component: Projet },
];
