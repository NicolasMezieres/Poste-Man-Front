import { Routes } from '@angular/router';
import { AuthComponent } from './page/auth/auth';
import { Erreur404 } from './page/erreur404/erreur404';
import { Erreur500 } from './page/erreur500/erreur500';
import { ForgetPasswordComponent } from './page/forget-password/forget-password';
import { HomeComponent } from './page/home/home';
import { Mention } from './page/mention/mention';
import { PresentationComponent } from './page/presentation/presentation';
import { ProfilComponent } from './page/profil/profil';
import { Projet } from './page/projet/projet';
import { ResetPasswordComponent } from './page/reset-password/reset-password';
import { SectionComponent } from './page/section/section';
import { TchatComponent } from './page/tchat/tchat';
import { ValidAccountComponent } from './page/valid-account/valid-account';

export const routes: Routes = [
  { path: '', component: PresentationComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'validAccount', component: ValidAccountComponent },
  { path: 'forgetPassword', component: ForgetPasswordComponent },
  { path: 'resetPassword/:token', component: ResetPasswordComponent },
  { path: 'home', component: HomeComponent },
  { path: 'home/:token', component: HomeComponent },
  { path: 'profil', component: ProfilComponent },
  { path: 'projet', component: Projet },
  { path: '500', component: Erreur500 },
  { path: '404', component: Erreur404 },
  { path: 'mentions', component: Mention },
  {
    path: 'project',
    children: [{ path: ':projectId/tchat', component: TchatComponent }],
  },
  { path: 'project/:projectId/section', component: SectionComponent },
];
