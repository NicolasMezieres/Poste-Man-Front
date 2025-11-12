import { Routes } from '@angular/router';
import { PresentationComponent } from './page/presentation/presentation';
import { AuthComponent } from './page/auth/auth';
import { ValidAccountComponent } from './page/valid-account/valid-account';

export const routes: Routes = [
  { path: '', component: PresentationComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'validAccount', component: ValidAccountComponent },
];
