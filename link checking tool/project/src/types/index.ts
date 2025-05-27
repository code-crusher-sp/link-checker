export interface VerificationResult {
  url: string;
  status: 'safe' | 'warning' | 'danger' | 'unknown';
  statusCode?: number;
  responseTime?: number;
  sslValid?: boolean;
  redirectCount?: number;
  securityScore: number;
  checkedAt: Date;
  details: {
    phishingDetected: boolean;
    malwareRisk: boolean;
    suspiciousDomain: boolean;
    redirectChain?: string[];
    domainAge?: string;
    hostingProvider?: string;
  };
}

export interface VerificationHistory {
  id: string;
  url: string;
  status: 'safe' | 'warning' | 'danger' | 'unknown';
  securityScore: number;
  checkedAt: Date;
}