import { Routes } from '@angular/router';
import { PresentationComponent } from './page/presentation/presentation';
import { AuthComponent } from './page/auth/auth';
import { ValidAccountComponent } from './page/valid-account/valid-account';
import { ForgetPasswordComponent } from './page/forget-password/forget-password';
import { ResetPasswordComponent } from './page/reset-password/reset-password';
import { HomeComponent } from './page/home/home';
import { ProfilComponent } from './page/profil/profil';
import { TchatComponent } from './page/tchat/tchat';
import { SectionComponent } from './page/section/section';
import { PostComponent } from './page/post/post';

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
      { path: ':projectId/tchat', component: TchatComponent },
      { path: ':projectId/section', component: SectionComponent },
      {
        path: ':projectId/section/:sectionId',
        component: PostComponent,
      },
    ],
  },
];
