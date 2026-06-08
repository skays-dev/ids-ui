import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../core/auth.service';
import { AlertsSocketService } from '../core/alerts-socket.service';
import { AlertSocketEvent } from '../core/models';
import {AlertToastService} from '../core/alerts-toast.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit, OnDestroy {
  private alertSub?: Subscription;

  constructor(
    public auth: AuthService,
    private alertsSocket: AlertsSocketService,
    private alertToast: AlertToastService
  ) {}

  ngOnInit(): void {
    this.alertsSocket.connect();

    this.alertSub = this.alertsSocket.alert$.subscribe((event: AlertSocketEvent) => {
      if (!event) {
        return;
      }

      if (event.type !== 'ALERT_CREATED' || !event.idsAlert) {
        return;
      }

      this.alertToast.showNewAlert(event.idsAlert);
    });
  }

  ngOnDestroy(): void {
    this.alertSub?.unsubscribe();
    this.alertsSocket.disconnect();
  }
}
