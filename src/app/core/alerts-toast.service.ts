import { Injectable } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';
import { AlertDto } from './models';

@Injectable({ providedIn: 'root' })
export class AlertToastService {
  constructor(private hotToast: HotToastService) {}

  showNewAlert(alert: AlertDto): void {
    const message =
      `${alert.attack || 'Unknown attack'} | ` +
      `${alert.srcIp || '-'}:${alert.srcPort ?? '-'} → ${alert.dstIp || '-'}:${alert.dstPort ?? '-'}`;

    switch (alert.riskCode) {
      case 'HIGH':
        this.hotToast.error(`HIGH alert: ${message}`, {
          dismissible: true,
          duration: 7000
        });
        break;

      case 'MEDIUM':
        this.hotToast.warning(`MEDIUM alert: ${message}`, {
          dismissible: true,
          duration: 5000
        });
        break;

      case 'LOW':
      default:
        this.hotToast.info(`LOW alert: ${message}`, {
          dismissible: true,
          duration: 4000
        });
        break;
    }
  }

  success(message: string): void {
    this.hotToast.success(message, {
      dismissible: true,
      duration: 4000
    });
  }

  error(message: string): void {
    this.hotToast.error(message, {
      dismissible: true,
      duration: 5000
    });
  }

  info(message: string): void {
    this.hotToast.info(message, {
      dismissible: true,
      duration: 4000
    });
  }

  warning(message: string): void {
    this.hotToast.warning(message, {
      dismissible: true,
      duration: 5000
    });
  }
}
