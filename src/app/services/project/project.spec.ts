import { TestBed } from '@angular/core/testing';

import { ProjectService } from './project';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('ProjectService', () => {
  let service: ProjectService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProjectService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ProjectService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('(GET) search', () => {
    const query = { page: 0, search: '' };
    it('Should get projects', () => {
      service.search(query).subscribe();
      const req = http.expectOne(
        `${environment.apiURL}project/search?search=${query.search}&page=${query.page}`,
      );
      expect(req.request.method).toEqual('GET');
    });
  });
  describe('(GET) searchByAdmin', () => {
    const query = { page: 0, search: '', fromDate: '', toDate: '' };
    it('Should get projects', () => {
      service.searchByAdmin(query).subscribe();
      const req = http.expectOne(
        `${environment.apiURL}project/searchAdmin?search=${query.search}&page=${query.page}&fromDate=${query.fromDate}&toDate=${query.toDate}`,
      );
      expect(req.request.method).toEqual('GET');
    });
  });
  describe('(GET) get Project', () => {
    it('Should get name of project, is moderator and is an admin', () => {
      service.getProject('projectId').subscribe();
      const req = http.expectOne(`${environment.apiURL}project/projectId`);
      expect(req.request.method).toEqual('GET');
    });
  });
  describe('(POST) create', () => {
    it('Should create a project', () => {
      const data = { name: 'name' };
      service.create(data).subscribe();
      const req = http.expectOne(`${environment.apiURL}project/create`);
      expect(req.request.method).toEqual('POST');
    });
  });
  describe('(POST) createInvitationLink', () => {
    it('Should create an invitation link', () => {
      service.createInvitationLink('projectId').subscribe();
      const req = http.expectOne(`${environment.apiURL}project/projectId/link`);
      expect(req.request.method).toEqual('POST');
    });
  });
  describe('(POST) joinProject', () => {
    it('Should join project', () => {
      service.joinProject('linkId').subscribe();
      const req = http.expectOne(`${environment.apiURL}project/linkId/join`);
      expect(req.request.method).toEqual('POST');
    });
  });
  describe('(PATCH) ban', () => {
    it('Should ban an member of this project', () => {
      service.ban('projectId', 'userId').subscribe();
      const req = http.expectOne(
        `${environment.apiURL}project/projectId/user/userId`,
      );
      expect(req.request.method).toEqual('PATCH');
    });
  });
  describe('(PATCH) rename', () => {
    it('Should renmae her project', () => {
      const data = { name: 'name' };
      service.rename('projectId', data).subscribe();
      const req = http.expectOne(`${environment.apiURL}project/projectId`);
      expect(req.request.method).toEqual('PATCH');
    });
  });
  describe('(DELETE) remove', () => {
    it('Should delete her project or leave a project', () => {
      service.remove('projectId').subscribe();
      const req = http.expectOne(`${environment.apiURL}project/projectId`);
      expect(req.request.method).toEqual('DELETE');
    });
  });
  describe('(DELETE) kickUser', () => {
    it('Should kick an user of her project', () => {
      service.kickUser('projectId', 'userId').subscribe();
      const req = http.expectOne(
        `${environment.apiURL}project/projectId/user/userId`,
      );
      expect(req.request.method).toEqual('DELETE');
    });
  });
});
