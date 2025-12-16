import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu';
import { ToastService } from 'src/app/services/toast/toast';
import { toastMock } from 'src/app/page/auth/mock/toast.mock';
import { MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { dialogMock } from '../../modal/create-post/mock/dialog.mock';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        { provide: ToastService, useValue: toastMock },
        { provide: MatDialogRef, useValue: dialogMock },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
