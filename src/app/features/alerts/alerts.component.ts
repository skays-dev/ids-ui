import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertsService } from '../../core/alerts.service';
import { AlertsSocketService } from '../../core/alerts-socket.service';
import { AlertDto, PageResponse } from '../../core/models';
import { AuthService } from '../../core/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css'
})
export class AlertsComponent implements OnInit, OnDestroy {
  data = signal<PageResponse<AlertDto> | null>(null);
  loading = false;
  page = 0;
  size = 10;
  status = '';
  risk = '';
  search = '';
  private sub?: Subscription;

  constructor(
    private alerts: AlertsService,
    private socket: AlertsSocketService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
    this.socket.connect();
    this.sub = this.socket.alert$.subscribe(() => this.load());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  load(): void {
    this.loading = true;
    this.alerts.list({ page: this.page, size: this.size, status: this.status, risk: this.risk, search: this.search }).subscribe({
      next: data => { this.data.set(data); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  applyFilters(): void {
    this.page = 0;
    this.load();
  }

  next(): void {
    const d = this.data();
    if (d && !d.last) { this.page++; this.load(); }
  }

  previous(): void {
    if (this.page > 0) { this.page--; this.load(); }
  }
  updateStatus(alert: AlertDto, statusCode: string): void {
    this.alerts.updateStatus(alert.id, statusCode).subscribe(() => this.load());
  }

  canEdit(): boolean {
    return this.auth.hasAnyRole(['ROLE_ADMIN', 'ROLE_ANALYST']);
  }

  riskClass(riskCode: string): string {
    return `risk-${riskCode.toLowerCase()}`;
  }
}
