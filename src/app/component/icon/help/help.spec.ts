import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconHelpComponent } from './help';

describe('IconHelpComponent', () => {
  let component: IconHelpComponent;
  let fixture: ComponentFixture<IconHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconHelpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
