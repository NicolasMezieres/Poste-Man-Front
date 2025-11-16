import { Routes } from '@angular/router';
import { AuthComponent } from './page/auth/auth';
import { Erreur404 } from './page/erreur404/erreur404';
import { Erreur500 } from './page/erreur500/erreur500';
import { PresentationComponent } from './page/presentation/presentation';
import { Projet } from './page/projet/projet';

export const routes: Routes = [
  { path: '', component: PresentationComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'projet', component: Projet },
  { path: '500', component: Erreur500 },
  { path: '404', component: Erreur404 },
];
