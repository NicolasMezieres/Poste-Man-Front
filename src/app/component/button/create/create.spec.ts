import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Create } from './create';
import { CreateProject } from '../../modal/project/create-project/create-project';
import { provideHttpClient } from '@angular/common/http';

describe('Create', () => {
  let component: Create;
  let fixture: ComponentFixture<Create>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Create],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(Create);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('openModal', () => {
    it('Should open modal CreateProject', () => {
      jest.spyOn(component['dialog'], 'open');
      component.openModal();
      expect(component['dialog'].open).toHaveBeenCalledWith(CreateProject, {
        data: component.closeMenu.emit(),
      });
    });
  });
});
