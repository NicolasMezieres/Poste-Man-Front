import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostComponent } from './post';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast/toast';
import { toastMock } from '../auth/mock/toast.mock';
import { PostService } from 'src/app/services/post/post';
import { postServiceMock } from './mock/post.service.mock';
import { HomeComponent } from '../home/home';
import { of, throwError } from 'rxjs';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let toast: ToastService;
  let router: Router;
  let postService: PostService;
  let route: ActivatedRoute;
  let view: HTMLElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostComponent],
      providers: [
        provideRouter([{ path: 'home', component: HomeComponent }]),
        provideHttpClient(),
        { provide: ToastService, useValue: toastMock },
        { provide: PostService, useValue: postServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    toast = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
    postService = TestBed.inject(PostService);
    route = TestBed.inject(ActivatedRoute);
    view = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Function ng On Init', () => {
    it('Should navigate to page home, paramsProject empty', () => {
      jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue(null);
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should navigate to page home, paramsSection empty', () => {
      jest
        .spyOn(route.snapshot.paramMap, 'get')
        .mockReturnValueOnce('projectId');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should show posts', () => {
      jest
        .spyOn(route.snapshot.paramMap, 'get')
        .mockReturnValueOnce('projectId')
        .mockReturnValueOnce('sectionId');
      jest.spyOn(postService, 'getPosts').mockReturnValue(
        of({
          data: [],
          isAdmin: false,
          isModerator: false,
          user: 'username',
        }),
      );
      component.ngOnInit();
      expect(component.isAdmin()).toBe(false);
      expect(component.isModerator()).toBe(false);
      expect(component.posts()).toEqual([]);
      expect(component.username()).toBe('username');
    });
    it('Should navigate to page auth, user not connected', () => {
      jest
        .spyOn(route.snapshot.paramMap, 'get')
        .mockReturnValueOnce('projectId')
        .mockReturnValueOnce('sectionId');
      jest.spyOn(postService, 'getPosts').mockReturnValue(
        throwError(() => ({
          status: 401,
          error: { message: 'Unauthorized' },
        })),
      );
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should navigate to page home, section not found', () => {
      jest
        .spyOn(route.snapshot.paramMap, 'get')
        .mockReturnValueOnce('projectId')
        .mockReturnValueOnce('sectionId');
      jest.spyOn(postService, 'getPosts').mockReturnValue(
        throwError(() => ({
          status: 404,
          error: { message: 'Section not found' },
        })),
      );
      jest.spyOn(toast, 'openFailToast').mockReturnValue();
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.ngOnInit();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  it('Should navigate to page home, user is not a member of this project', () => {
    jest
      .spyOn(route.snapshot.paramMap, 'get')
      .mockReturnValueOnce('projectId')
      .mockReturnValueOnce('sectionId');
    jest.spyOn(postService, 'getPosts').mockReturnValue(
      throwError(() => ({
        status: 403,
        error: { message: 'You are not a member of this project' },
      })),
    );
    jest.spyOn(toast, 'openFailToast').mockReturnValue();
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    component.ngOnInit();
    expect(toast.openFailToast).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });

  describe('Function moveCard', () => {
    const data = [
      {
        createdAt: String(new Date()),
        id: 'id',
        isArchive: false,
        poseX: 15,
        poseY: 16,
        score: 0,
        text: 'texte',
        updatedAt: 'encore une date',
        user: { username: 'username', id: 'id' },
        vote: [],
      },
    ];
    it("Should return nothing, card doesn't exist", () => {
      const dragEvent = { target: null } as DragEvent;
      fixture.detectChanges();
      component.moveCard(dragEvent);
      expect(dragEvent.target).toBe(null);
    });
    it("Should return nothing, table doesn't exist", () => {
      const title = view.querySelector('h1');
      const dragEvent = { target: title } as DragEvent;
      view.querySelector('#table')?.remove();
      fixture.detectChanges();
      const table = view.querySelector('#table');
      component.moveCard(dragEvent);
      expect(table).toEqual(null);
    });
    it('Should move Card in the ground', () => {
      component.posts.update(() => data);
      fixture.detectChanges();
      const card = view.querySelector('article');
      const dragEvent = { target: card } as DragEvent;
      fixture.detectChanges();
      component.moveCard(dragEvent);
    });
    it('Should move Card in exterious of the ground (top left)', () => {
      component.posts.update(() => data);
      fixture.detectChanges();
      const card = view.querySelector('article');
      const dragEvent = { target: card, clientX: -5, clientY: -5 } as DragEvent;
      component.moveCard(dragEvent);
      fixture.detectChanges();
      expect(card?.style.left).toEqual('0px');
      expect(card?.style.left).toEqual('0px');
    });
    it('Should move Card in exterious of the ground (right bottom)', () => {
      component.posts.update(() => data);
      fixture.detectChanges();
      const card = view.querySelector('article');
      const table = view.querySelector('#table');
      const boundingCard = card?.getBoundingClientRect();
      if (!table || !boundingCard) return;
      const dragEvent = {
        target: card,
        clientX: 1,
        clientY: 31,
      } as DragEvent;
      if (card) {
        component.moveCard(dragEvent);
        fixture.detectChanges();
        expect(card.style.left).toEqual('0px');
        expect(card.style.top).toEqual('0px');
      }
    });
  });
});
