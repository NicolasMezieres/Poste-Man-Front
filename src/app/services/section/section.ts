import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import {
  formSectionType,
  resFormSectionType,
  resMessageType,
  resSectionType,
} from 'src/app/utils/type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  #http = inject(HttpClient);
  #url = environment.apiURL;
  getSections(projectId: string): Observable<resSectionType> {
    return this.#http
      .get<resSectionType>(`${this.#url}section/project/${projectId}`, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  createSection(
    data: formSectionType,
    projectId: string,
  ): Observable<resFormSectionType> {
    return this.#http
      .post<resFormSectionType>(
        `${this.#url}section/project/${projectId}/create`,
        data,
        { withCredentials: true },
      )
      .pipe(take(1));
  }
  updateSection(
    data: formSectionType,
    sectionId: string,
    projectId: string,
  ): Observable<resFormSectionType> {
    return this.#http
      .patch<resFormSectionType>(
        `${this.#url}section/${sectionId}/project/${projectId}`,
        data,
        { withCredentials: true },
      )
      .pipe(take(1));
  }
  removeSection(sectionId: string): Observable<resMessageType> {
    return this.#http
      .delete<resMessageType>(`${this.#url}section/${sectionId}`, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  removeAllSection(projectId: string): Observable<resMessageType> {
    return this.#http
      .delete<resMessageType>(`${this.#url}section/project/${projectId}`, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
}
