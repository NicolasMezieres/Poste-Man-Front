import { TestBed } from '@angular/core/testing';

import { SectionService } from './section';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('SectionService', () => {
  let service: SectionService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SectionService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(SectionService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  const projectId = 'projectId';
  const sectionId = 'sectionId';
  describe('(GET) getSections', () => {
    it('Should get sections of project success', () => {
      service.getSections(projectId).subscribe();
      const req = http.expectOne(
        `${environment.apiURL}section/project/${projectId}`,
      );
      expect(req.request.method).toEqual('GET');
    });
  });
  describe('(POST) createSection', () => {
    const dataForm = { name: 'sectionName' };
    it('Should create section success', () => {
      service.createSection(dataForm, projectId).subscribe();
      const req = http.expectOne(
        `${environment.apiURL}section/project/${projectId}/create`,
      );
      expect(req.request.method).toEqual('POST');
    });
  });
  describe('(PATCH) updateSection', () => {
    const dataForm = { name: 'sectionName' };
    it('Should section updated', () => {
      service.updateSection(dataForm, sectionId, projectId).subscribe();
      const req = http.expectOne(
        `${environment.apiURL}section/${sectionId}/project/${projectId}`,
      );
      expect(req.request.method).toEqual('PATCH');
    });
  });
  describe('(DELETE) createSection', () => {
    it('Should section deleted', () => {
      service.removeSection(sectionId).subscribe();
      const req = http.expectOne(`${environment.apiURL}section/${sectionId}`);
      expect(req.request.method).toEqual('DELETE');
    });
  });
});
