import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { take } from 'rxjs';
import { ToastComponent } from 'src/app/component/toast/toast';
import {
  dataSigninType,
  dataSignupType,
  HttpErrorResponseType,
  resMessageType,
  resSigninType,
} from 'src/app/utils/type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #toast = inject(ToastComponent);
  #http = inject(HttpClient);
  readonly #url = environment.apiURL;
  signup(data: dataSignupType) {
    return this.#http
      .post<resMessageType>(`${this.#url}auth/signup`, data, {
        withCredentials: true,
      })
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.#toast.openSuccesToast(res.message);
        },
        error: (err: HttpErrorResponse) => {
          this.#toast.openFailToast(err);
        },
      });
  }
  signin(data: dataSigninType) {
    return this.#http
      .post<resSigninType>(`${this.#url}auth/signin`, data, {
        withCredentials: true,
      })
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.#toast.openSuccesToast(res.message);
        },
        error: (err: HttpErrorResponseType) => {
          this.#toast.openFailToast(err);
        },
      });
  }
}
