import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import { environment } from '../../environments/environment';
import { AlertSocketEvent } from './models';

@Injectable({ providedIn: 'root' })
export class AlertsSocketService {
  private client?: Client;
  private readonly alertSubject = new Subject<AlertSocketEvent>();

  readonly alert$ = this.alertSubject.asObservable();

  constructor(private zone: NgZone) {}

  connect(): void {
    if (this.client?.active) {
      return;
    }

    const token = localStorage.getItem('ids_access_token');

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${environment.apiUrl}/ws`),
      reconnectDelay: 5000,
      connectHeaders: token
        ? {
          Authorization: `Bearer ${token}`
        }
        : {},
      onConnect: () => {
        console.log('[socket] connected');

        this.client?.subscribe('/topic/idsAlerts', (message: IMessage) => {
          this.zone.run(() => {
            try {
              const event = JSON.parse(message.body) as AlertSocketEvent;
              console.log('AlertSocketEvent', event);
              this.alertSubject.next(event);
            } catch (e) {
              console.error('[socket] parse error', e, message.body);
            }
          });
        });

        console.log('[socket] subscribed to /topic/idsAlerts');
      },
      onStompError: frame => {
        console.error('[socket] stomp error', frame);
      },
      onWebSocketError: event => {
        console.error('[socket] websocket error', event);
      },
      onWebSocketClose: event => {
        console.warn('[socket] websocket closed', event);
      }
    });

    this.client.activate();
  }

  disconnect(): void {
    this.client?.deactivate();
  }
}
