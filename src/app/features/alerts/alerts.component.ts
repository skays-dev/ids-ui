import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AlertsService } from '../../core/alerts.service';
import { AlertsSocketService } from '../../core/alerts-socket.service';
import { AlertDto, PageResponse } from '../../core/models';
import { AuthService } from '../../core/auth.service';
import { AlertDetailsDialogComponent } from './alert-details-dialog/alert-details-dialog.component';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertDetailsDialogComponent],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css'
})
export class AlertsComponent implements OnInit, OnDestroy {
  data = signal<PageResponse<AlertDto> | null>(null);
  selectedAlert = signal<AlertDto | null>(null);

  loading = false;
  page = 0;
  size = 10;
  status = '';
  risk = '';
  search = '';

  readonly statusOptions = [
    { code: 'NEW', label: 'New' },
    { code: 'VERIFIED', label: 'Verified' },
    { code: 'SAFE', label: 'Safe' }
  ];

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

    this.alerts.list({
      page: this.page,
      size: this.size,
      status: this.status,
      risk: this.risk,
      search: this.search
    }).subscribe({
      next: data => {
        this.data.set(data);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.page = 0;
    this.load();
  }

  next(): void {
    const d = this.data();

    if (d && !d.last) {
      this.page++;
      this.load();
    }
  }

  previous(): void {
    if (this.page > 0) {
      this.page--;
      this.load();
    }
  }

  openDetails(alert: AlertDto): void {
    this.selectedAlert.set(alert);
  }

  closeDetails(): void {
    this.selectedAlert.set(null);
  }

  updateStatus(alert: AlertDto, statusCode: string): void {
    this.alerts.updateStatus(alert.id, statusCode).subscribe(() => this.load());
  }

  onStatusChange(alert: AlertDto, nextStatus: string): void {
    if (!nextStatus || nextStatus === alert.statusCode) {
      return;
    }

    this.updateStatus(alert, nextStatus);
  }

  canEdit(): boolean {
    return this.auth.hasAnyRole(['ROLE_ADMIN', 'ROLE_ANALYST']);
  }

  riskClass(riskCode: string): string {
    return `risk-${riskCode?.toLowerCase()}`;
  }

  statusClass(statusCode: string): string {
    return `status-${statusCode?.toLowerCase()}`;
  }
}
