import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsService } from '../../core/alerts.service';
import { AlertsSocketService } from '../../core/alerts-socket.service';
import { AlertStats } from '../../core/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats = signal<AlertStats | null>(null);
  private sub?: Subscription;

  constructor(private alerts: AlertsService, private socket: AlertsSocketService) {}

  ngOnInit(): void {
    this.load();
    this.socket.connect();
    this.sub = this.socket.alert$.subscribe(() => this.load());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  load(): void {
    this.alerts.stats().subscribe(stats => this.stats.set(stats));
  }

  value(map: Record<string, number> | undefined, key: string): number {
    return map?.[key] || 0;
  }
}
