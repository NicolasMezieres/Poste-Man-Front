import { Routes } from '@angular/router';
import { Presentation } from './page/presentation/presentation';
import { AuthComponent } from './page/auth/auth';

export const routes: Routes = [
  { path: '', component: Presentation },
  { path: 'auth', component: AuthComponent },
];
