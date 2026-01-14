import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { member, resListenAuthData } from 'src/app/utils/type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthSocketService {
  private socket = io(environment.gatewayURL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    withCredentials: true,
  });
  #isAlreadyConnected = signal<boolean>(false);
  listenToException() {
    this.socket.on('connect_error', () => {
      this.socket.io.opts.reconnection = false;
      this.socket.disconnect();
      this.#isAlreadyConnected.update(() => false);
    });
  }
  constructor() {
    this.listenToException();
  }
  authSocket() {
    if (!this.#isAlreadyConnected()) {
      this.socket.emit('auth');
      this.#isAlreadyConnected.update(() => true);
    }
  }
  connectedListMember(projectId: string): Promise<member[]> {
    return this.socket.emitWithAck('listMember', projectId);
  }
  listenAuth() {
    return new Observable<resListenAuthData>((observer) => {
      this.socket.on('online', (data: { userId: string }) => {
        observer.next({
          isConnected: true,
          type: 'online',
          ...data,
        });
      });
      this.socket.on('offline', (data: { userId: string }) => {
        observer.next({
          isConnected: false,
          type: 'offline',
          ...data,
        });
      });
      this.socket.on('userJoinProject', (data: member) => {
        observer.next({ type: 'userJoinProject', ...data });
      });
      this.socket.on('userLeaveProject', (data: { userId: string }) => {
        observer.next({ ...data, type: 'userLeaveProject' });
      });
    });
  }
}
