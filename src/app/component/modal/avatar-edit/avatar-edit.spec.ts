import { ComponentFixture, TestBed } from '@angular/core/testing';

import { dialogAvatarEditComponent } from './avatar-edit';

describe('dialogAvatarEditComponent', () => {
  let component: dialogAvatarEditComponent;
  let fixture: ComponentFixture<dialogAvatarEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [dialogAvatarEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(dialogAvatarEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
