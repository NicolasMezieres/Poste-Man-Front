import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import {
  formChangePassword,
  myAccountType,
  resMessageType,
  resMyAccountType,
} from 'src/app/utils/type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #http = inject(HttpClient);
  #url = environment.apiURL;
  myAccount(): Observable<resMyAccountType> {
    return this.#http
      .get<resMyAccountType>(`${this.#url}user/myAccount`, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  updateMyAccount(data: myAccountType): Observable<resMessageType> {
    return this.#http
      .patch<resMessageType>(`${this.#url}user/myAccount`, data, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  changePassword(data: formChangePassword): Observable<resMessageType> {
    return this.#http
      .patch<resMessageType>(`${this.#url}user/changePassword`, data, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  changeAvatar(icon: string): Observable<resMessageType> {
    return this.#http
      .patch<resMessageType>(
        `${this.#url}user/changeAvatar`,
        { icon },
        { withCredentials: true },
      )
      .pipe(take(1));
  }
  deleteAccount(): Observable<resMessageType> {
    return this.#http
      .delete<resMessageType>(`${this.#url}user/account/desactivate`, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
}
