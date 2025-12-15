import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { resMessageType, resProjectMessage } from 'src/app/utils/type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  #http = inject(HttpClient);
  readonly #url = environment.apiURL;

  getProjectMessages(
    projectId: string,
    items: number,
  ): Observable<resProjectMessage> {
    return this.#http
      .get<resProjectMessage>(
        `${this.#url}message/project/${projectId}?items=${items}`,
        {
          withCredentials: true,
        },
      )
      .pipe(take(1));
  }

  createMessage(
    data: { message: string },
    projectId: string,
  ): Observable<resMessageType> {
    return this.#http
      .post<resMessageType>(`${this.#url}message/project/${projectId}`, data, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
}
