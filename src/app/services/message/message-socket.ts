import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { messageSocketType } from 'src/app/utils/type';
@Injectable({
  providedIn: 'root',
})
export class MessageSocketService {
  private socket = io(environment.gatewayURL, {
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  listenToException() {
    this.socket.on('exception', (error) => {
      console.log(error);
      this.socket.io.opts.reconnection = false;
      this.socket.disconnect();
    });
  }
  constructor() {
    this.listenToException();
  }
  listenMessage(): Observable<messageSocketType> {
    return new Observable((observer) => {
      this.socket.on('message', (message: messageSocketType) => {
        observer.next(message);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
  joinRoom(projectId: string) {
    this.socket.emit('messageJoinRoom', projectId);
  }
}
