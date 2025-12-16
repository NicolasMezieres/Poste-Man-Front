import { Routes } from '@angular/router';
import { AuthComponent } from './page/auth/auth';
import { Erreur404 } from './page/erreur404/erreur404';
import { Erreur500 } from './page/erreur500/erreur500';
import { ForgetPasswordComponent } from './page/forget-password/forget-password';
import { HomeComponent } from './page/home/home';
import { Mention } from './page/mention/mention';
import { PresentationComponent } from './page/presentation/presentation';
import { ProfilComponent } from './page/profil/profil';
import { TchatComponent } from './page/tchat/tchat';
import { SectionComponent } from './page/section/section';
import { PostComponent } from './page/post/post';
import { Projet } from './page/projet/projet';
import { ResetPasswordComponent } from './page/reset-password/reset-password';
import { ValidAccountComponent } from './page/valid-account/valid-account';
import { ProjectComponent } from './page/project/project';

export const routes: Routes = [
  { path: '', component: PresentationComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'validAccount', component: ValidAccountComponent },
  { path: 'forgetPassword', component: ForgetPasswordComponent },
  { path: 'resetPassword/:token', component: ResetPasswordComponent },
  { path: 'home', component: HomeComponent },
  { path: 'home/:token', component: HomeComponent },
  { path: 'profil', component: ProfilComponent },
  {
    path: 'project',
    children: [
      { path: ':projectId', component: ProjectComponent },
      { path: ':projectId/tchat', component: TchatComponent },
      { path: ':projectId/section', component: SectionComponent },
      {
        path: ':projectId/section/:sectionId',
        component: PostComponent,
      },
    ],
  },
  { path: 'projet', component: Projet },
  { path: '500', component: Erreur500 },
  { path: 'mentions', component: Mention },
  { path: '**', component: Erreur404 },
];
