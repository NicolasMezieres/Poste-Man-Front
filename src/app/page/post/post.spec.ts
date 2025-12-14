import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostComponent } from './post';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast/toast';
import { toastMock } from '../auth/mock/toast.mock';
import { PostService } from 'src/app/services/post/post';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostComponent],
      providers:[
        provideRouter([]),
        provideHttpClient(),
        {provide:ToastService,useValue:toastMock},
        {provide:PostService, useValue:postServiceMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
