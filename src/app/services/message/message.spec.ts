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
  const projectId = 'projectId';
  describe('(GET) get Project Messages', () => {
    const nbrMessage = 0;
    it('Should get message of project', () => {
      service.getProjectMessages(projectId, nbrMessage).subscribe();
      const req = http.expectOne(
        `${environment.apiURL}message/project/${projectId}?items=${nbrMessage}`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush({ data: 'data' });
    });
    it('Should fail', () => {
      service.getProjectMessages(projectId, nbrMessage).subscribe();
      const req = http.expectOne(
        `${environment.apiURL}message/project/${projectId}?items=${nbrMessage}`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush(null, { status: 401, statusText: 'Unauthorized' });
    });
  });
  describe('(GET) get Project Name', () => {
    it('Should get name of project', () => {
      service.getProjectName(projectId).subscribe();
      const req = http.expectOne(
        `${environment.apiURL}message/project/${projectId}/name`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush({ projectName: 'projectName' });
    });
    it('Should fail', () => {
      service.getProjectName(projectId).subscribe();
      const req = http.expectOne(
        `${environment.apiURL}message/project/${projectId}/name`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush(null, { status: 401, statusText: 'Unauthorized' });
    });
  });
  describe('(POST) create Message', () => {
    const data = { message: 'message' };
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
  describe('/(DELETE) delete Message', () => {
    const messageId = 'messageId';
    it('Should message deleted', () => {
      service.deleteMessage(messageId).subscribe();
      const req = http.expectOne(`${environment.apiURL}message/${messageId}`);
      expect(req.request.method).toEqual('DELETE');
      req.flush({ message: 'deleted' });
    });
    it('Should fail', () => {
      service.deleteMessage(messageId).subscribe();
      const req = http.expectOne(`${environment.apiURL}message/${messageId}`);
      expect(req.request.method).toEqual('DELETE');
      req.flush(null, { status: 401, statusText: 'Unauthorized' });
    });
  });
  describe('/(DELETE) delete All Message', () => {
    it('Should messages deleted', () => {
      service.deleteAllMessage(projectId).subscribe();
      const req = http.expectOne(
        `${environment.apiURL}message/project/${projectId}`,
      );
      expect(req.request.method).toEqual('DELETE');
      req.flush({ message: 'deleted' });
    });
    it('Should fail', () => {
      service.deleteAllMessage(projectId).subscribe();
      const req = http.expectOne(
        `${environment.apiURL}message/project/${projectId}`,
      );
      expect(req.request.method).toEqual('DELETE');
      req.flush(null, { status: 401, statusText: 'Unauthorized' });
    });
  });
});
