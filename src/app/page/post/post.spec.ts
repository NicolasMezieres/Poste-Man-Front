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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { dialogMock } from 'src/app/component/modal/dialogMock/dialog-mock';
import { EditPostComponent } from 'src/app/component/modal/post/edit-post/edit-post';
import { postMock } from 'src/app/component/modal/post/mock/post-mock';
import { DeletePostComponent } from 'src/app/component/modal/post/delete-post/delete-post';
import { TransfertPostComponent } from 'src/app/component/modal/post/transfert-post/transfert-post';
import { PostSocketService } from 'src/app/services/post/post-socket';
import { postSocketMock } from './mock/post.socket.service.mock';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let toast: ToastService;
  let router: Router;
  let postService: PostService;
  let route: ActivatedRoute;
  let view: HTMLElement;
  let dialog: MatDialog;
  let socket: PostSocketService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostComponent],
      providers: [
        provideRouter([{ path: 'home', component: HomeComponent }]),
        provideHttpClient(),
        { provide: ToastService, useValue: toastMock },
        { provide: PostService, useValue: postServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: PostSocketService, useValue: postSocketMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    toast = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
    postService = TestBed.inject(PostService);
    route = TestBed.inject(ActivatedRoute);
    view = fixture.nativeElement as HTMLElement;
    dialog = TestBed.inject(MatDialog);
    socket = TestBed.inject(PostSocketService);
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());
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
          sectionName: 'name',
        }),
      );
      jest.spyOn(socket, 'listenPost').mockReturnValue(of());
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
      jest.spyOn(socket, 'listenPost').mockReturnValue(of());
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
      jest.spyOn(socket, 'listenPost').mockReturnValue(of());
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
    jest.spyOn(socket, 'listenPost').mockReturnValue(of());
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
  describe('Function openModalCreatePost', () => {
    it('Should open dialog and call endpoint createPost from postService', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of({ isSubmit: true, text: 'text' })),
      } as unknown as MatDialogRef<EditPostComponent>);
      jest
        .spyOn(postService, 'createPost')
        .mockReturnValue(of({ message: 'success', data: postMock }));
      component.openModalCreatePost();
      expect(dialog.open).toHaveBeenCalledWith(EditPostComponent, {
        data: { text: '' },
      });
      expect(postService.createPost).toHaveBeenCalled();
    });
  });
  describe('Function create Post', () => {
    const dialogMock = () =>
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of({ isSubmit: true, text: 'text' })),
      } as unknown as MatDialogRef<EditPostComponent>);
    it('Should success', () => {
      dialogMock();
      jest.spyOn(toast, 'openSuccesToast');
      jest
        .spyOn(postService, 'createPost')
        .mockReturnValue(of({ message: 'success', data: postMock }));
      component.openModalCreatePost();
      expect(toast.openSuccesToast).toHaveBeenCalled();
      expect(postService.createPost).toHaveBeenCalled();
    });
    it('Should fail, navigate to page auth, unauhtorized (401)', () => {
      dialogMock();
      jest.spyOn(toast, 'openFailToast');
      jest
        .spyOn(postService, 'createPost')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalCreatePost();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(postService.createPost).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail, navigate to page home, not a member (403)', () => {
      dialogMock();
      jest.spyOn(toast, 'openFailToast');
      jest
        .spyOn(postService, 'createPost')
        .mockReturnValue(throwError(() => ({ status: 403 })));
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalCreatePost();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(postService.createPost).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail, navigate to page home, section not found (404)', () => {
      dialogMock();
      jest.spyOn(toast, 'openFailToast');
      jest
        .spyOn(postService, 'createPost')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalCreatePost();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(postService.createPost).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('Function get Postion', () => {
    it('Should fail return pose 0', () => {
      const table = view.querySelector('#table');
      table?.remove();
      fixture.detectChanges();
      expect(component.getPosition()).toEqual({
        poseX: 0,
        poseY: 0,
      });
    });
  });
  describe('Function open Modal Update Post', () => {
    it('Should call endpoint updatePost from postService', () => {
      const table = view.querySelector('#table');
      const post = document.createElement('article');
      post.setAttribute('id', postMock.id);
      table?.appendChild(post);
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of({ isSubmit: true, text: 'text' })),
      } as unknown as MatDialogRef<EditPostComponent>);
      jest
        .spyOn(postService, 'updatePost')
        .mockReturnValue(of({ message: 'success', data: postMock }));
      component.openModalUpdatePost(postMock);
      expect(dialog.open).toHaveBeenCalledWith(EditPostComponent, {
        data: { text: postMock.text },
      });
      expect(postService.updatePost).toHaveBeenCalled();
    });
  });
  describe('Function update Post', () => {
    const dialogMock = () =>
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of({ isSubmit: true, text: 'text' })),
      } as unknown as MatDialogRef<EditPostComponent>);
    const createPost = () => {
      const table = view.querySelector('#table');
      const post = document.createElement('article');
      post.setAttribute('id', postMock.id);
      table?.appendChild(post);
    };
    it('Should success', () => {
      dialogMock();
      createPost();
      jest
        .spyOn(postService, 'updatePost')
        .mockReturnValue(of({ message: 'succes', data: postMock }));
      jest.spyOn(toast, 'openSuccesToast');
      component.openModalUpdatePost(postMock);
      expect(postService.updatePost).toHaveBeenCalled();
      expect(toast.openSuccesToast).toHaveBeenCalled();
    });
    it('Should fail unauthorized (401), navigate to page auth', () => {
      dialogMock();
      createPost();
      jest
        .spyOn(postService, 'updatePost')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalUpdatePost(postMock);
      expect(postService.updatePost).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail not a membre (403), navigate to page home', () => {
      dialogMock();
      createPost();
      jest
        .spyOn(postService, 'updatePost')
        .mockReturnValue(throwError(() => ({ status: 403 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalUpdatePost(postMock);
      expect(postService.updatePost).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail not found post (404), navigate to page home', () => {
      dialogMock();
      createPost();
      jest
        .spyOn(postService, 'updatePost')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalUpdatePost(postMock);
      expect(postService.updatePost).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('Function open Modal Delete Post', () => {
    it('Should call endpoint delete from postService', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isSubmit: true })),
      } as unknown as MatDialogRef<DeletePostComponent>);
      jest.spyOn(postService, 'delete');
      component.openModalDeletePost(postMock);
      expect(dialog.open).toHaveBeenCalledWith(DeletePostComponent, {
        data: { post: postMock },
      });
      expect(postService.delete).toHaveBeenCalled();
    });
  });
  describe('Function delete Post', () => {
    const dialogMock = () =>
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isSubmit: true })),
      } as unknown as MatDialogRef<DeletePostComponent>);
    it('Should success post deleted', () => {
      dialogMock();
      jest
        .spyOn(postService, 'delete')
        .mockReturnValue(of({ message: 'succes' }));
      jest.spyOn(toast, 'openSuccesToast');
      component.openModalDeletePost(postMock);
      expect(toast.openSuccesToast).toHaveBeenCalled();
      expect(postService.delete).toHaveBeenCalled();
    });
    it('Should fail unauthorized (401), redirect to page auth', () => {
      dialogMock();
      jest
        .spyOn(postService, 'delete')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalDeletePost(postMock);
      expect(postService.delete).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail not a member (403), redirect to page home', () => {
      dialogMock();
      jest
        .spyOn(postService, 'delete')
        .mockReturnValue(throwError(() => ({ status: 403 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalDeletePost(postMock);
      expect(postService.delete).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail post not found (404), redirect to page home', () => {
      dialogMock();
      jest
        .spyOn(postService, 'delete')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalDeletePost(postMock);
      expect(postService.delete).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('open Modal Transfert Post', () => {
    it('Should call endpoint transfertPost from postService', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of({ isSubmit: true, sectionId: 'id' })),
      } as unknown as MatDialogRef<TransfertPostComponent>);
      jest.spyOn(postService, 'transfertPost');
      component.openModalTransfertPost(postMock);
      expect(dialog.open).toHaveBeenCalledWith(TransfertPostComponent, {
        data: {
          post: postMock,
          projectId: component.projectId(),
          sectionId: component.sectionId(),
        },
      });
      expect(postService.transfertPost).toHaveBeenCalled();
    });
  });
  describe('transfert Post', () => {
    const dialogMock = () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of({ isSubmit: true, sectionId: 'id' })),
      } as unknown as MatDialogRef<TransfertPostComponent>);
    };
    it('Should success', () => {
      dialogMock();
      jest
        .spyOn(postService, 'transfertPost')
        .mockReturnValue(of({ message: 'succes' }));
      jest.spyOn(toast, 'openSuccesToast');
      component.openModalTransfertPost(postMock);
      expect(postService.transfertPost).toHaveBeenCalled();
      expect(toast.openSuccesToast).toHaveBeenCalled();
    });
    it('Should fail, unauthorized (401), navigate to page auth', () => {
      dialogMock();
      jest
        .spyOn(postService, 'transfertPost')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalTransfertPost(postMock);
      expect(postService.transfertPost).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
      expect(toast.openFailToast).toHaveBeenCalled();
    });
    it('Should fail, post already in section (403), navigate to page home', () => {
      dialogMock();
      jest
        .spyOn(postService, 'transfertPost')
        .mockReturnValue(throwError(() => ({ status: 403 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalTransfertPost(postMock);
      expect(postService.transfertPost).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
      expect(toast.openFailToast).toHaveBeenCalled();
    });
    it('Should fail, post or section not found (404), navigate to page home', () => {
      dialogMock();
      jest
        .spyOn(postService, 'transfertPost')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalTransfertPost(postMock);
      expect(postService.transfertPost).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
      expect(toast.openFailToast).toHaveBeenCalled();
    });
  });
  describe('open Modal Transfert All Post', () => {
    it('Should call transfert All Post from postService', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of({ isSubmit: true, sectionId: 'id' })),
      } as unknown as MatDialogRef<TransfertPostComponent>);
      jest.spyOn(postService, 'transfertAllPost');
      component.openModalTransfertAllPost();
      expect(dialog.open).toHaveBeenCalledWith(TransfertPostComponent, {
        data: {
          isAllPost: true,
          projectId: component.projectId(),
          sectionId: component.sectionId(),
        },
      });
      expect(postService.transfertAllPost).toHaveBeenCalled();
    });
  });
  describe('transfert All Post', () => {
    const dialogMock = () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest
          .fn()
          .mockReturnValue(of({ isSubmit: true, sectionId: 'id' })),
      } as unknown as MatDialogRef<TransfertPostComponent>);
    };
    it('Should success', () => {
      dialogMock();
      jest
        .spyOn(postService, 'transfertAllPost')
        .mockReturnValue(of({ message: 'success' }));
      jest.spyOn(toast, 'openSuccesToast');
      component.openModalTransfertAllPost();
      expect(toast.openSuccesToast).toHaveBeenCalled();
      expect(postService.transfertAllPost).toHaveBeenCalled();
      expect(component.posts()).toEqual([]);
    });
    it('Should fail unauthorized (401), redirect to page auth', () => {
      dialogMock();
      jest
        .spyOn(postService, 'transfertAllPost')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalTransfertAllPost();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(postService.transfertAllPost).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail post already in this section (403), redirect to page home', () => {
      dialogMock();
      jest
        .spyOn(postService, 'transfertAllPost')
        .mockReturnValue(throwError(() => ({ status: 403 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalTransfertAllPost();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(postService.transfertAllPost).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail section not found (404), redirect to page home', () => {
      dialogMock();
      jest
        .spyOn(postService, 'transfertAllPost')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalTransfertAllPost();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(postService.transfertAllPost).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('open Modal Delete All Post', () => {
    it('Should call endpoint deleteAll from postService', () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isSubmit: true })),
      } as unknown as MatDialogRef<DeletePostComponent>);
      jest.spyOn(postService, 'deleteAll').mockReturnValue(of());
      component.openModalDeleteAllPost();
      expect(postService.deleteAll).toHaveBeenCalled();
      expect(dialog.open).toHaveBeenCalledWith(DeletePostComponent, {
        data: { isAllPost: true },
      });
    });
  });
  describe('delete All Post', () => {
    const dialogMock = () => {
      jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of({ isSubmit: true })),
      } as unknown as MatDialogRef<DeletePostComponent>);
    };
    it('Should success', () => {
      dialogMock();
      jest
        .spyOn(postService, 'deleteAll')
        .mockReturnValue(of({ message: 'success' }));
      jest.spyOn(toast, 'openSuccesToast');
      component.openModalDeleteAllPost();
      expect(postService.deleteAll).toHaveBeenCalled();
      expect(toast.openSuccesToast).toHaveBeenCalled();
      expect(component.posts()).toEqual([]);
    });
    it('Should fail unauthorized (401), redirect to page auth', () => {
      dialogMock();
      jest
        .spyOn(postService, 'deleteAll')
        .mockReturnValue(throwError(() => ({ status: 401 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalDeleteAllPost();
      expect(postService.deleteAll).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['auth']);
    });
    it('Should fail not a moderator (403), redirect to page home', () => {
      dialogMock();
      jest
        .spyOn(postService, 'deleteAll')
        .mockReturnValue(throwError(() => ({ status: 403 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalDeleteAllPost();
      expect(postService.deleteAll).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
    it('Should fail section not found (404), redirect to page home', () => {
      dialogMock();
      jest
        .spyOn(postService, 'deleteAll')
        .mockReturnValue(throwError(() => ({ status: 404 })));
      jest.spyOn(toast, 'openFailToast');
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
      component.openModalDeleteAllPost();
      expect(postService.deleteAll).toHaveBeenCalled();
      expect(toast.openFailToast).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['home']);
    });
  });
  describe('debounceCard', () => {
    it('Should test', () => {
      jest.useFakeTimers();
      jest.spyOn(postService, 'movePost').mockReturnValue(of());
      component.subjectMoveCard.next({ id: 'id', poseX: 0, poseY: 0 });
      jest.advanceTimersByTime(1000);
      expect(postService.movePost).toHaveBeenCalled();
    });
  });
  describe('Post Socket Subscription', () => {
    it('Should received action Create', () => {
      jest
        .spyOn(socket, 'listenPost')
        .mockReturnValue(of({ action: 'create', post: postMock }));
      component.posts.set([]);
      component.postSocketSubscription();
      expect(socket.listenPost).toHaveBeenCalled();
      expect(component.posts()).toEqual([postMock]);
    });
    it('Should received action Update', () => {
      jest
        .spyOn(socket, 'listenPost')
        .mockReturnValue(of({ action: 'update', post: postMock }));
      component.posts.set([{ ...postMock, text: 'otherText' }]);
      component.postSocketSubscription();
      expect(socket.listenPost).toHaveBeenCalled();
      expect(component.posts()).toEqual([postMock]);
    });
    it('Should received action Delete', () => {
      jest
        .spyOn(socket, 'listenPost')
        .mockReturnValue(of({ action: 'delete', post: postMock }));
      component.posts.set([postMock]);
      component.postSocketSubscription();
      expect(socket.listenPost).toHaveBeenCalled();
      expect(component.posts()).toEqual([]);
    });
    it('Should received action Move', () => {
      jest
        .spyOn(socket, 'listenPost')
        .mockReturnValue(of({ action: 'transfert', post: postMock }));
      component.posts.set([postMock]);
      component.postSocketSubscription();
      expect(socket.listenPost).toHaveBeenCalled();
      expect(component.posts()).toEqual([]);
    });
    it('Should received action Vote', () => {
      jest
        .spyOn(socket, 'listenPost')
        .mockReturnValue(of({ action: 'vote', post: postMock }));
      component.posts.set([{ ...postMock, score: 5 }]);
      component.postSocketSubscription();
      expect(socket.listenPost).toHaveBeenCalled();
      expect(component.posts()).toEqual([postMock]);
    });
    it('Should received action Reset', () => {
      jest
        .spyOn(socket, 'listenPost')
        .mockReturnValue(of({ action: 'reset', post: postMock }));
      component.posts.set([postMock]);
      component.postSocketSubscription();
      expect(socket.listenPost).toHaveBeenCalled();
      expect(component.posts()).toEqual([]);
    });
  });
});
