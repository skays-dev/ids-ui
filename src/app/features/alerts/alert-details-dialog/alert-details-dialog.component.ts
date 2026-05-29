import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AlertDto } from '../../../core/models';

@Component({
  selector: 'app-alert-details-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-details-dialog.component.html',
  styleUrl: './alert-details-dialog.component.css'
})
export class AlertDetailsDialogComponent {
  @Input({ required: true }) alert!: AlertDto;
  @Output() close = new EventEmitter<void>();

  riskClass(riskCode: string): string {
    return `risk-${riskCode?.toLowerCase()}`;
  }

  statusClass(statusCode: string): string {
    return `status-${statusCode?.toLowerCase()}`;
  }
}
