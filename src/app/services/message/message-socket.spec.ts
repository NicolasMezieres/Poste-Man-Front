import { TestBed } from '@angular/core/testing';
import { MessageSocketService } from './message-socket';

describe('MessageSocketService', () => {
  let service: MessageSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
