import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailUserPage } from './detail-user';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HomeComponent } from '../home/home';

describe('DetailUserPage', () => {
  let component: DetailUserPage;
  let fixture: ComponentFixture<DetailUserPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailUserPage],
      providers: [
        provideRouter([{ path: 'home', component: HomeComponent }]),
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
