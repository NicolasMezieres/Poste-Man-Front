import { Routes } from '@angular/router';
import { PresentationComponent } from './page/presentation/presentation';
import { AuthComponent } from './page/auth/auth';
import { ValidAccountComponent } from './page/valid-account/valid-account';
import { ForgetPasswordComponent } from './page/forget-password/forget-password';
import { ResetPasswordComponent } from './page/reset-password/reset-password';
import { HomeComponent } from './page/home/home';

export const routes: Routes = [
  { path: '', component: PresentationComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'validAccount', component: ValidAccountComponent },
  { path: 'forgetPassword', component: ForgetPasswordComponent },
  { path: 'resetPassword/:token', component: ResetPasswordComponent },
  { path: 'home', component: HomeComponent },
];
