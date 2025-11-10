import { Component, inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponseType } from 'src/app/utils/type';
@Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastComponent {
  #snackBar = inject(MatSnackBar);
  durationSeconds = 5;
  failToast(message: string) {
    this.#snackBar.open(message, '', {
      verticalPosition: 'top',
      panelClass: 'toastFail',
      duration: this.durationSeconds * 1000,
    });
  }
  succesToast(message: string) {
    this.#snackBar.open(message, '', {
      verticalPosition: 'top',
      panelClass: 'toastSucces',
      duration: this.durationSeconds * 1000,
    });
  }
  openFailToast(err: HttpErrorResponseType) {
    if (err.status === 500 || err.status === 0) {
      this.failToast(
        'Une erreur est survenue avec le serveur, veuillez réessayer plus tard !',
      );
    } else {
      const isArrayMessage = typeof err.error.message === 'object';
      if (isArrayMessage) {
        this.failToast(err.error.message[0]);
      } else {
        this.failToast(err.error.message);
      }
    }
  }
  openSuccesToast(message: string) {
    this.succesToast(message);
  }
}
