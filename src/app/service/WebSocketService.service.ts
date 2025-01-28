import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: WebSocket;
  private subject = new Subject<string>();

  constructor() {}

  connect(url: string): Observable<string> {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      console.log('Mensaje recibido:', event.data); // Log para verificar datos recibidos
      this.subject.next(event.data);
    };

    this.socket.onclose = () => {
      console.log('Conexión WebSocket cerrada.');
    };

    return this.subject.asObservable();
  }
}
