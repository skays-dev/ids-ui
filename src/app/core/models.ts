export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  username: string;
  roles: string[];
}

export interface AlertDto {
  id: number;
  time: string;
  reason: string;
  attack: string;
  confidence: number;

  riskCode: 'LOW' | 'MEDIUM' | 'HIGH';
  riskLabel: string;

  statusCode: 'NEW' | 'VERIFIED' | 'SAFE';
  statusLabel: string;

  srcIp: string;
  dstIp: string;
  srcPort: number;
  dstPort: number;
  proto: number;

  aiDetected: boolean;
  aiConfidence: number | null;
  aiLabel: string | null;

  ruleDetected: boolean;
  ruleId: string | null;
  ruleCategory: string | null;
  ruleMsg: string | null;

  correlationKey: string | null;
  evidence?: string | null;

  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface AlertStats {
  total: number;
  last24h: number;
  newIdsAlerts: number;
  highRiskNew: number;
  byRisk: Record<string, number>;
  byStatus: Record<string, number>;
}


export interface AlertSocketEvent {
  type: 'ALERT_UPDATED' | 'ALERTS_REFRESH_REQUIRED';
  at: string;
  alert?: AlertDto;
}
