import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconMoreComponent } from './more';

describe('IconMoreComponent', () => {
  let component: IconMoreComponent;
  let fixture: ComponentFixture<IconMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconMoreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
