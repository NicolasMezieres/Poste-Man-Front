import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
})
export class MessageSocketService {
    #socket = io(environment.gatewayURL + '/message', {
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });
  listenToException() {
    this.#socket.on('exception', (error) => {
      console.log(error);
      this.#socket.io.opts.reconnection = false;
      this.#socket.disconnect();
    });
  }
  constructor() {
    this.listenToException();
  }
}