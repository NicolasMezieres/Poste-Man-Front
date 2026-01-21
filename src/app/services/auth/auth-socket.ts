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
    reconnectionDelay: 2000,
    reconnectionAttempts: 5,
    withCredentials: true,
    autoConnect: false,
  });
  #isAlreadyConnected = signal<boolean>(false);
  #isAlreadyListen = signal<boolean>(false);
  deconnection() {
    this.socket.disconnect();
    this.#isAlreadyListen.update(() => false);
    this.#isAlreadyConnected.update(() => false);
  }
  listenToException() {
    this.socket.on('connect_error', () => {
      this.socket.io.opts.reconnection = false;
      this.socket.disconnect();
      this.#isAlreadyConnected.update(() => false);
      this.#isAlreadyListen.update(() => false);
    });
  }
  constructor() {
    this.listenToException();
  }
  getProject(projectId: string) {
    if (!this.#isAlreadyListen() && projectId) {
      console.log('getProject');
      this.connectedListMember(projectId);
      this.#isAlreadyListen.update(() => true);
    }
  }
  authSocket() {
    if (!this.#isAlreadyConnected()) {
      this.socket.connect();
      this.socket.emit('auth');
      this.#isAlreadyConnected.update(() => true);
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
