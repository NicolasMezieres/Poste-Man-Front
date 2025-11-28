import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { resProjectMessage } from 'src/app/utils/type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  #http = inject(HttpClient);
  readonly #url = environment.apiURL;

  getProjectMessages(projectId: string): Observable<resProjectMessage> {
    return this.#http
      .get<resProjectMessage>(`${this.#url}message/project/${projectId}`, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
}
