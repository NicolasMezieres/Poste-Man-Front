import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertConfirmation } from './transfert-confirmation';

describe('TransfertConfirmation', () => {
  let component: TransfertConfirmation;
  let fixture: ComponentFixture<TransfertConfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfertConfirmation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransfertConfirmation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
