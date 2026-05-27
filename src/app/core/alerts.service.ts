import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AlertDto, AlertStats, PageResponse } from './models';

@Injectable({ providedIn: 'root' })
export class AlertsService {
  constructor(private http: HttpClient) {}

  list(params: { page: number; size: number; status?: string; risk?: string; search?: string }): Observable<PageResponse<AlertDto>> {
    let httpParams = new HttpParams()
      .set('page', params.page)
      .set('size', params.size);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.risk) httpParams = httpParams.set('risk', params.risk);
    if (params.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<PageResponse<AlertDto>>(`${environment.apiUrl}/api/alerts`, { params: httpParams });
  }

  stats(): Observable<AlertStats> {
    return this.http.get<AlertStats>(`${environment.apiUrl}/api/alerts/stats`);
  }
  updateStatus(id: number, statusCode: string): Observable<AlertDto> {
    return this.http.patch<AlertDto>(`${environment.apiUrl}/api/alerts/${id}/status`, { statusCode });
  }
}
