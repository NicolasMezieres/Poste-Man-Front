import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProjectPage } from './detail-project';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { HomeComponent } from '../home/home';

describe('DetailProjectPage', () => {
  let component: DetailProjectPage;
  let fixture: ComponentFixture<DetailProjectPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailProjectPage],
      providers: [
        provideHttpClient(),
        provideRouter([{ path: 'home', component: HomeComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
