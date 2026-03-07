import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, take } from 'rxjs';
import {
  dataForgetPasswordType,
  dataResetPasswordType,
  dataSigninType,
  dataSignupType,
  resLogData,
  resMessageType,
  resSigninType,
} from 'src/app/utils/type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #http = inject(HttpClient);
  #isAdmin = signal<boolean>(false);
  readonly #url = environment.apiURL;
  signup(data: dataSignupType): Observable<resMessageType> {
    return this.#http.post<resMessageType>(`${this.#url}auth/signup`, data, {
      withCredentials: true,
    });
  }
  signin(data: dataSigninType): Observable<resSigninType> {
    const res = this.#http.post<resSigninType>(
      `${this.#url}auth/signin`,
      data,
      {
        withCredentials: true,
      },
    );
    res.subscribe({
      next: (res) => {
        this.#isAdmin.update(() => res.role === 'Admin');
      },
    });
    return res;
  }

  activAccount(token: string): Observable<resMessageType> {
    return this.#http.patch<resMessageType>(
      `${this.#url}auth/activationAccount/${token}`,
      null,
      { withCredentials: true },
    );
  }

  forgetPassword(data: dataForgetPasswordType): Observable<resMessageType> {
    return this.#http.post<resMessageType>(
      `${this.#url}auth/forgetPassword`,
      data,
      {
        withCredentials: true,
      },
    );
  }

  resetPassword(
    token: string,
    data: dataResetPasswordType,
  ): Observable<resMessageType> {
    const headers = { Authorization: `Bearer ${token}` };
    return this.#http
      .patch<resMessageType>(`${this.#url}auth/resetPasswordWithToken`, data, {
        headers,
      })
      .pipe(take(1));
  }
  logout(): Observable<resMessageType> {
    const res = this.#http
      .delete<resMessageType>(`${this.#url}auth/logout`, {
        withCredentials: true,
      })
      .pipe(take(1));
    res.subscribe({
      next: () => {
        this.#isAdmin.update(() => false);
      },
    });
    return res;
  }
  log(): Observable<resLogData> {
    const res = this.#http
      .get<resLogData>(`${this.#url}auth/log`, { withCredentials: true })
      .pipe(take(1));
    res.subscribe({
      next: (res) => {
        this.#isAdmin.update(() => res.isAdmin);
      },
    });
    return res;
  }
  getIsAdmin() {
    return this.#isAdmin();
  }
}
