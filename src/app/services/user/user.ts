import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { resMyAccountType } from 'src/app/utils/type';
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
}
