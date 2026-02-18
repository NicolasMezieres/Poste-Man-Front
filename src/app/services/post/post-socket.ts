import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { postSocketType } from 'src/app/utils/type';
@Injectable({
  providedIn: 'root',
})
export class PostSocketService {
  private socket = io(environment.apiURL, {
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    transports:["websocket"]
  });

  listenToException() {
    this.socket.on('exception', () => {
      this.socket.io.opts.reconnection = false;
      this.socket.disconnect();
    });
  }
  constructor() {
    this.listenToException();
  }
  listenPost(): Observable<postSocketType> {
    return new Observable((observer) => {
      this.socket.on('post', (data: postSocketType) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
  
  joinRoom(projectId: string) {
    if (!this.socket.connected) {
      this.socket.connect();
    }
    this.socket.emit('postJoinRoom', projectId);
  }
}
