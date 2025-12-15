import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';
setupZonelessTestEnv();
Object.defineProperty(window, 'DragEvent', {
  value: class DragEvent {},
});
