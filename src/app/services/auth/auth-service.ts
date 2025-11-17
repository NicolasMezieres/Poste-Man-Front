import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import {
  dataForgetPasswordType,
  dataResetPasswordType,
  dataSigninType,
  dataSignupType,
  resMessageType,
  resSigninType,
} from 'src/app/utils/type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #http = inject(HttpClient);
  readonly #url = environment.apiURL;
  signup(data: dataSignupType): Observable<resMessageType> {
    return this.#http
      .post<resMessageType>(`${this.#url}auth/signup`, data, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  signin(data: dataSigninType): Observable<resSigninType> {
    return this.#http
      .post<resSigninType>(`${this.#url}auth/signin`, data, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  activAccount(token: string): Observable<resMessageType> {
    return this.#http
      .patch<resMessageType>(
        `${this.#url}auth/activationAccount/${token}`,
        null,
        { withCredentials: true },
      )
      .pipe(take(1));
  }
  forgetPassword(data: dataForgetPasswordType): Observable<resMessageType> {
    return this.#http
      .post<resMessageType>(`${this.#url}auth/forgetPassword`, data, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  resetPassword(
    token: string,
    data: dataResetPasswordType,
  ): Observable<resMessageType> {
    const headers = { Authorization: `Bearer ${token}` };
    return this.#http.patch<resMessageType>(
      `${this.#url}auth/resetPasswordWithToken`,
      data,
      { headers },
    );
  }
}
