import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import {
  formPostType,
  resEditPostType,
  resMessageType,
  resPostType,
  voteType,
} from 'src/app/utils/type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  #http = inject(HttpClient);
  #url = environment.apiURL;

  getPosts(sectionId: string): Observable<resPostType> {
    return this.#http
      .get<resPostType>(`${this.#url}post/section/${sectionId}`, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  createPost(
    sectionId: string,
    data: formPostType,
  ): Observable<resEditPostType> {
    return this.#http.post<resEditPostType>(
      `${this.#url}post/section/${sectionId}`,
      data,
      {
        withCredentials: true,
      },
    );
  }
  updatePost(postId: string, data: formPostType): Observable<resEditPostType> {
    return this.#http.patch<resEditPostType>(
      `${this.#url}post/${postId}`,
      data,
      {
        withCredentials: true,
      },
    );
  }
  transfertPost(postId: string, sectionId: string): Observable<resMessageType> {
    return this.#http
      .patch<resMessageType>(
        `${this.#url}post/${postId}/transfert/${sectionId}`,
        null,
        {
          withCredentials: true,
        },
      )
      .pipe(take(1));
  }
  transfertAllPost(
    sectionId: string,
    moveSectionId: string,
  ): Observable<resMessageType> {
    return this.#http
      .patch<resMessageType>(
        `${this.#url}post/section/${sectionId}/transfert/${moveSectionId}`,
        null,
        { withCredentials: true },
      )
      .pipe(take(1));
  }
  vote(postId: string, data: voteType): Observable<resMessageType> {
    return this.#http
      .put<resMessageType>(`${this.#url}post/${postId}/vote`, data, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  delete(postId: string): Observable<resMessageType> {
    return this.#http
      .delete<resMessageType>(`${this.#url}post/${postId}`, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
  deleteAll(sectionId: string): Observable<resMessageType> {
    return this.#http
      .delete<resMessageType>(`${this.#url}post/section/${sectionId}`, {
        withCredentials: true,
      })
      .pipe(take(1));
  }
}
