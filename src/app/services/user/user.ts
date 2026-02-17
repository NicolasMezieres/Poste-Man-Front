import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import {
  formChangePassword,
  myAccountType,
  reqSearchUserType,
  resDetailUserType,
  resMessageType,
  resMyAccountType,
  resSearchUserType,
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
  searchUser(data: reqSearchUserType): Observable<resSearchUserType> {
    return this.#http
      .get<resSearchUserType>(
        `${this.#url}user/userList?search=${data.search}&page=${data.page}&isActive=${data.isActive}`,
        { withCredentials: true },
      )
      .pipe(take(1));
  }
  getUser(userId: string): Observable<resDetailUserType> {
    return this.#http
      .get<resDetailUserType>(`${this.#url}user/${userId}/detail`, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  banUser(userId: string): Observable<resMessageType> {
    return this.#http
      .patch<resMessageType>(`${this.#url}user/${userId}/ban`, null, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  deleteUser(userId: string): Observable<resMessageType> {
    return this.#http
      .delete<resMessageType>(`${this.#url}user/${userId}/delete`, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
}
