import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarComponent } from './side-bar';
import { MenuComponent } from '../icon/menu/menu';
import { provideHttpClient } from '@angular/common/http';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBarComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  // providers: [{ provide: MatDialog, useValue: { open: jest.fn() } }],
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Function Open Menu', () => {
    it('Should open Menu', () => {
      jest.spyOn(component['dialog'], 'open');
      component.openMenu();
      expect(component['dialog'].open).toHaveBeenCalledWith(MenuComponent, {
        position: { top: '0', left: '0' },
      });
    });
  });
});
