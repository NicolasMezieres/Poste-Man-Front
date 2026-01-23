import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import {
  nameType,
  querySearchAdminType,
  querySearchType,
  resCreateInvitationLikeType,
  resCreateProject,
  resGetProjectType,
  resJoinProjectType,
  resMessageType,
  resSearchProject,
  resSearchProjectByAdmin,
} from 'src/app/utils/type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  #http = inject(HttpClient);
  #url = environment.apiURL + 'project/';

  search(query: querySearchType): Observable<resSearchProject> {
    return this.#http
      .get<resSearchProject>(
        `${this.#url}search?search=${query.search}&page=${query.page}`,
        {
          withCredentials: true,
        },
      )
      .pipe(take(1));
  }
  searchByAdmin(
    query: querySearchAdminType,
  ): Observable<resSearchProjectByAdmin> {
    return this.#http
      .get<resSearchProjectByAdmin>(
        `${this.#url}searchAdmin?search=${query.search}&page=${query.page}&fromDate=${query.fromDate}&toDate=${query.toDate}`,
        { withCredentials: true },
      )
      .pipe(take(1));
  }
  getProject(projectId: string): Observable<resGetProjectType> {
    return this.#http
      .get<resGetProjectType>(`${this.#url}${projectId}`, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  create(data: nameType): Observable<resCreateProject> {
    return this.#http
      .post<resCreateProject>(`${this.#url}create`, data, {
        withCredentials: true,
      })
      .pipe(take(1));
  }

  createInvitationLink(
    projectId: string,
  ): Observable<resCreateInvitationLikeType> {
    return this.#http
      .post<resCreateInvitationLikeType>(
        `${this.#url}${projectId}/link`,
        null,
        {
          withCredentials: true,
        },
      )
      .pipe(take(1));
  }
  joinProject(linkId: string): Observable<resJoinProjectType> {
    return this.#http
      .post<resJoinProjectType>(`${this.#url}${linkId}/join`, null, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  ban(projectId: string, userId: string): Observable<resMessageType> {
    return this.#http
      .patch<resMessageType>(`${this.#url}${projectId}/user/${userId}`, null, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  rename(projectId: string, data: nameType): Observable<resMessageType> {
    return this.#http
      .patch<resMessageType>(`${this.#url}${projectId}`, data, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  remove(projectId: string): Observable<resMessageType> {
    return this.#http
      .delete<resMessageType>(`${this.#url}${projectId}`, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  kickUser(projectId: string, userId: string): Observable<resMessageType> {
    return this.#http
      .delete<resMessageType>(`${this.#url}${projectId}/user/${userId}`, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
}
