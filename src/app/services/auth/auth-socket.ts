import { Injectable } from '@angular/core';
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
    reconnectionDelay: 2000,
    reconnectionAttempts: 5,
    withCredentials: true,
    autoConnect: false,
  });
  deconnection() {
    this.socket.disconnect();
  }
  listenToException() {
    this.socket.on('connect_error', () => {
      this.socket.io.opts.reconnection = false;
      this.socket.disconnect();
    });
  }
  constructor() {
    this.listenToException();
  }
  getProject(projectId: string) {
    if (projectId) {
      this.connectedListMember(projectId);
    }
  }
  authSocket() {
    if (!this.socket.connected) {
      this.socket.connect();
      this.socket.emit('auth');
    }
  }
  connectedListMember(projectId: string): Promise<member[]> {
    this.authSocket();
    return this.socket.emitWithAck('listMember', projectId);
  }
  listenAuth() {
    return new Observable<resListenAuthData>((observer) => {
      this.socket.on(
        'auth',
        (auth: { userId: string; member?: member; action: string }) => {
          observer.next({
            isConnected: true,
            type: auth.action,
            ...auth,
          });
        },
      );
    });
  }
}
