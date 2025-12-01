import { TestBed } from '@angular/core/testing';

import { MessageService } from './message';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

describe('MessageService', () => {
  let service: MessageService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessageService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(MessageService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('(GET) get Project Messages', () => {
    const projectId = 'projectId';
    it('Should get message of project', () => {
      service.getProjectMessages(projectId).subscribe();
      const req = http.expectOne(
        `${environment.apiURL}message/project/${projectId}`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush({ data: 'data' });
    });
    it('Should fail', () => {
      service.getProjectMessages(projectId).subscribe();
      const req = http.expectOne(
        `${environment.apiURL}message/project/${projectId}`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush(null, { status: 401, statusText: 'Unauthorized' });
    });
  });
  describe('(POST) create Message', () => {
    const data = { message: 'message' };
    const projectId = 'projectId';
    it('Should get message of project', () => {
      service.createMessage(data, projectId).subscribe();
      const req = http.expectOne(
        `${environment.apiURL}message/project/${projectId}`,
      );
      expect(req.request.method).toEqual('POST');
      req.flush({ data: 'data' });
    });
    it('Should fail', () => {
      service.createMessage(data, projectId).subscribe();
      const req = http.expectOne(
        `${environment.apiURL}message/project/${projectId}`,
      );
      expect(req.request.method).toEqual('POST');
      req.flush(null, { status: 401, statusText: 'Unauthorized' });
    });
  });
});
