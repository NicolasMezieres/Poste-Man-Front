import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import {
  resMessageType,
  resProjectMessage,
  resProjectName,
} from 'src/app/utils/type';
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
  getProjectName(projectId: string): Observable<resProjectName> {
    return this.#http
      .get<resProjectName>(`${this.#url}message/project/${projectId}/name`, {
        withCredentials: true,
      })
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
  deleteMessage(messageId: string): Observable<resMessageType> {
    return this.#http
      .delete<resMessageType>(`${this.#url}message/${messageId}`, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  deleteAllMessage(projectId: string): Observable<resMessageType> {
    return this.#http
      .delete<resMessageType>(`${this.#url}message/project/${projectId}`, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
}
