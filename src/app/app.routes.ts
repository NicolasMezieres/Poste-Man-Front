import { Routes } from '@angular/router';
import { AuthComponent } from './page/auth/auth';
import { ForgetPasswordComponent } from './page/forget-password/forget-password';
import { HomeComponent } from './page/home/home';
import { PresentationComponent } from './page/presentation/presentation';
import { ProfilComponent } from './page/profil/profil';
import { ResetPasswordComponent } from './page/reset-password/reset-password';
import { ValidAccountComponent } from './page/valid-account/valid-account';

export const routes: Routes = [
  { path: '', component: PresentationComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'validAccount', component: ValidAccountComponent },
  { path: 'forgetPassword', component: ForgetPasswordComponent },
  { path: 'resetPassword/:token', component: ResetPasswordComponent },
  { path: 'home', component: HomeComponent },
  { path: 'profil', component: ProfilComponent },
];
