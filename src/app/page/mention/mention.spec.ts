import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { Footer } from '../../component/footer/footer';
import { Logo } from '../../component/logo/logo';
import { Mention } from './mention';

describe('Mention', () => {
  let component: Mention;
  let fixture: ComponentFixture<Mention>;
  let locationSpy: Location;

  beforeEach(async () => {
    locationSpy = {
      back: jest.fn(),
    } as unknown as Location;

    await TestBed.configureTestingModule({
      imports: [Mention, Logo, Footer, MatButtonModule, MatIconModule],
      providers: [{ provide: Location, useValue: locationSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Mention);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a back button', () => {
    const button = fixture.debugElement.query(
      By.css('button[mat-icon-button]'),
    );
    expect(button).toBeTruthy();
  });

  it('should call location.back() when getBack() is triggered', () => {
    component.getBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should call getBack() when clicking the back button', () => {
    const getBackSpy = jest.spyOn(component, 'getBack');

    const button = fixture.debugElement.query(
      By.css('button[mat-icon-button]'),
    );
    button.triggerEventHandler('click');

    expect(getBackSpy).toHaveBeenCalled();
    expect(locationSpy.back).toHaveBeenCalled();
  });
});
