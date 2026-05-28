import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../environments/environment';
import { AlertSocketEvent } from './models';

@Injectable({ providedIn: 'root' })
export class AlertsSocketService {
  private client?: Client;
  private alertSubject = new Subject<AlertSocketEvent>();
  alert$ = this.alertSubject.asObservable();

  constructor(private zone: NgZone) {}

  connect(): void {
    if (this.client?.active) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${environment.apiUrl}/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        this.client?.subscribe('/topic/idsAlerts', (message: IMessage) => {
          this.zone.run(() => this.alertSubject.next(JSON.parse(message.body) as AlertSocketEvent));
        });
      }
    });

    this.client.activate();
  }

  disconnect(): void {
    this.client?.deactivate();
  }
}
