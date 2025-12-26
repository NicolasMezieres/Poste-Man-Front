import { TestBed } from '@angular/core/testing';

import { PostService } from './post';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

describe('PostService', () => {
  let service: PostService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PostService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('/(GET) getPosts', () => {
    it('Should get posts of project ', () => {
      const sectionId = 'sectionId';
      const path = `${environment.apiURL}post/section/${sectionId}`;
      service.getPosts(sectionId).subscribe();
      const req = http.expectOne(path);
      expect(req.request.method).toEqual('GET');
    });
  });
  describe('/(POST) createPost', () => {
    it('Should create post', () => {
      const sectionId = 'sectionId';
      const data = { text: 'post', poseX: 0, poseY: 0 };
      const path = `${environment.apiURL}post/section/${sectionId}`;
      service.createPost(sectionId, data).subscribe();
      const req = http.expectOne(path);
      expect(req.request.method).toEqual('POST');
    });
  });
  describe('/(PATCH) updatePost', () => {
    it('Should update post', () => {
      const postId = 'postId';
      const data = { text: 'post', poseX: 0, poseY: 0 };
      const path = `${environment.apiURL}post/${postId}`;
      service.updatePost(postId, data).subscribe();
      const req = http.expectOne(path);
      expect(req.request.method).toEqual('PATCH');
    });
  });
  describe('/(PATCH) movePost', () => {
    it('Should move post to another section', () => {
      const postId = 'postId';
      const sectionId = 'sectionId';
      const path = `${environment.apiURL}post/${postId}/move/${sectionId}`;
      service.movePost(postId, sectionId).subscribe();
      const req = http.expectOne(path);
      expect(req.request.method).toEqual('PATCH');
    });
  });
  describe('/(PATCH) moveAllPost', () => {
    it('Should move all post to another section', () => {
      const sectionId = 'sectionId';
      const moveSectionId = 'moveSectionId';
      const path = `${environment.apiURL}post/section/${sectionId}/move/${moveSectionId}`;
      service.moveAllPost(sectionId, moveSectionId).subscribe();
      const req = http.expectOne(path);
      expect(req.request.method).toEqual('PATCH');
    });
  });
  describe('/(PUT) vote', () => {
    it('Should vote post', () => {
      const postId = 'postId';
      const data = { isUp: true };
      const path = `${environment.apiURL}post/${postId}/vote`;
      service.vote(postId, data).subscribe();
      const req = http.expectOne(path);
      expect(req.request.method).toEqual('PUT');
    });
  });
  describe('/(DELETE) delete', () => {
    it('Should delete post', () => {
      const postId = 'postId';
      const path = `${environment.apiURL}post/${postId}`;
      service.delete(postId).subscribe();
      const req = http.expectOne(path);
      expect(req.request.method).toEqual('DELETE');
    });
  });
  describe('/(DELETE) deleteAll', () => {
    it('Should delete all post of section', () => {
      const sectionId = 'sectionId';
      const path = `${environment.apiURL}post/section/${sectionId}`;
      service.deleteAll(sectionId).subscribe();
      const req = http.expectOne(path);
      expect(req.request.method).toEqual('DELETE');
    });
  });
});
