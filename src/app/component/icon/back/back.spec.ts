import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconBackComponent } from './back';
import { Location } from '@angular/common';

describe('IconBackComponent', () => {
  let component: IconBackComponent;
  let fixture: ComponentFixture<IconBackComponent>;
  let location: Location;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconBackComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconBackComponent);
    location = TestBed.inject(Location);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Function backk To The Future', () => {
    it('Should back to previous page', () => {
      jest.spyOn(location, 'back').mockReturnValue();
      component.backToTheFuture();
      expect(location.back).toHaveBeenCalled();
    });
  });
});
