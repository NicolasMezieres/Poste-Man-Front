import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHelp } from './dialog-help';

describe('DialogHelp', () => {
  let component: DialogHelp;
  let fixture: ComponentFixture<DialogHelp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogHelp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogHelp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
