import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarHarness } from '@angular/material/snack-bar/testing';
import { ToastService } from './toast';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
describe('ToastService', () => {
  let fixture: ComponentFixture<ToastService>;
  let loader: HarnessLoader;
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
    fixture = TestBed.createComponent(ToastService);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });
  describe('Success Toast', () => {
    it('Should open toast success', async () => {
      fixture.componentInstance.succesToast('Success');
      const toast = await loader.getHarness(MatSnackBarHarness);
      expect(await toast.getMessage()).toBe('Success');
    });
  });
  describe('Fail Toast', () => {
    it('Should open toast fail', async () => {
      fixture.componentInstance.failToast('Fail');
      const toast = await loader.getHarness(MatSnackBarHarness);
      expect(await toast.getMessage()).toBe('Fail');
    });
  });
  describe('Open Fail Toast', () => {
    it('Should return fail toast with error 500', async () => {
      fixture.componentInstance.openFailToast({
        status: 500,
        error: { message: 'erreur' },
      });
      const toast = await loader.getHarness(MatSnackBarHarness);
      expect(await toast.getMessage()).toBe(
        'Une erreur est survenue avec le serveur, veuillez réessayer plus tard !',
      );
    });
    it('Should return fail toast with error 0', async () => {
      fixture.componentInstance.openFailToast({
        status: 0,
        error: { message: 'erreur' },
      });
      const toast = await loader.getHarness(MatSnackBarHarness);
      expect(await toast.getMessage()).toBe(
        'Une erreur est survenue avec le serveur, veuillez réessayer plus tard !',
      );
    });
    it('Should return fail toast with error 400', async () => {
      fixture.componentInstance.openFailToast({
        status: 400,
        error: { message: ['message need minimum 1 caractères', ''] },
      });
      const toast = await loader.getHarness(MatSnackBarHarness);
      expect(await toast.getMessage()).toBe(
        'message need minimum 1 caractères',
      );
    });
    it('Should return fail toast with error', async () => {
      fixture.componentInstance.openFailToast({
        status: 400,
        error: { message: 'account not found' },
      });
      const toast = await loader.getHarness(MatSnackBarHarness);
      expect(await toast.getMessage()).toBe('account not found');
    });
  });
  describe('Open Success Toast', () => {
    it('Should return toast message', async () => {
      fixture.componentInstance.openSuccesToast('account has been created');
      const toast = await loader.getHarness(MatSnackBarHarness);
      expect(await toast.getMessage()).toBe('account has been created');
    });
  });
});
