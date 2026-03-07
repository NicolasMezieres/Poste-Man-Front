import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListMemberComponent } from '../../modal/list-member/list-member';
import { ProjectService } from 'src/app/services/project/project';
import { projectServiceMock } from '../../icon/menu/mock/project.service.mock';
import { buttonGroupMobile } from './button.group.mobile';

describe('buttonGroupMobile', () => {
  let component: buttonGroupMobile;
  let fixture: ComponentFixture<buttonGroupMobile>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [buttonGroupMobile],
      providers: [{ provide: ProjectService, useValue: projectServiceMock }],
    }).compileComponents();
    fixture = TestBed.createComponent(buttonGroupMobile);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('projectId', 'projectId');
    fixture.componentRef.setInput('isModerator', false);
    fixture.componentRef.setInput('isAdmin', false);
    fixture.detectChanges();
  });
  it('Should be defined', () => {
    expect(component).toBeDefined();
  });
  describe('openDialogGroup', () => {
    it('Should open dialog', () => {
      jest.spyOn(component['dialog'], 'open');
      component.openDialogGroup();
      expect(component['dialog'].open).toHaveBeenCalledWith(
        ListMemberComponent,
        {
          position: { right: '0' },
          minWidth: '375px',
          panelClass: 'dialog-rectangle',
          data: {
            projectId: component.projectId(),
            isModerator: component.isModerator(),
            isAdmin: component.isAdmin(),
          },
        },
      );
    });
  });
});
