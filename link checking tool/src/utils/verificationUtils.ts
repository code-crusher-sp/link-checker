import { VerificationResult } from '../types';

// Mock data for domain reputation
const knownBadDomains = [
  'evil-site.com',
  'malware-download.net',
  'phishing-attempt.org',
  'fake-bank.com',
  'not-google.com',
  'free-v-bucks.site',
];

// Mock function to check if a domain is suspicious (in a real app, this would call an API)
export const isDomainSuspicious = (url: string): boolean => {
  try {
    const domain = new URL(url).hostname;
    return knownBadDomains.some(badDomain => domain.includes(badDomain));
  } catch (error) {
    return true; // Invalid URL is suspicious
  }
};

// Mock function to check for phishing indicators
export const hasPhishingIndicators = (url: string): boolean => {
  const phishingKeywords = ['login', 'signin', 'account', 'password', 'secure', 'update', 'verify'];
  const lowerUrl = url.toLowerCase();
  
  // This is a simplified check - real checks would be more sophisticated
  const hasKeywords = phishingKeywords.some(keyword => lowerUrl.includes(keyword));
  const hasSuspiciousDomain = isDomainSuspicious(url);
  const hasExcessiveDashes = (url.match(/-/g) || []).length > 3;
  
  return (hasKeywords && (hasSuspiciousDomain || hasExcessiveDashes));
};

// Mock function to check for malware risk
export const hasMalwareRisk = (url: string): boolean => {
  const malwareExtensions = ['.exe', '.zip', '.msi', '.bat', '.scr'];
  const hasRiskyExtension = malwareExtensions.some(ext => url.toLowerCase().includes(ext));
  return hasRiskyExtension || isDomainSuspicious(url);
};

// Generate a security score from 0-100
export const calculateSecurityScore = (result: Partial<VerificationResult>): number => {
  let score = 100;
  
  // Deduct for security issues
  if (result.details?.phishingDetected) score -= 40;
  if (result.details?.malwareRisk) score -= 30;
  if (result.details?.suspiciousDomain) score -= 25;
  if (result.sslValid === false) score -= 20;
  if (result.redirectCount && result.redirectCount > 3) score -= 10;
  if (result.statusCode && (result.statusCode < 200 || result.statusCode >= 400)) score -= 15;
  
  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, score));
};

// Mock verification function (in a real app, this would make actual HTTP requests)
export const verifyLink = async (url: string): Promise<VerificationResult> => {
  // Validate URL format
  let formattedUrl = url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    formattedUrl = 'https://' + url;
  }
  
  try {
    new URL(formattedUrl);
  } catch (error) {
    return {
      url: url,
      status: 'danger',
      securityScore: 0,
      checkedAt: new Date(),
      details: {
        phishingDetected: false,
        malwareRisk: false,
        suspiciousDomain: true,
      }
    };
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const isSuspiciousDomain = isDomainSuspicious(formattedUrl);
  const hasPhishing = hasPhishingIndicators(formattedUrl);
  const hasMalware = hasMalwareRisk(formattedUrl);
  
  // Create initial result
  const result: Partial<VerificationResult> = {
    url: formattedUrl,
    statusCode: Math.random() > 0.2 ? 200 : 404,
    responseTime: Math.floor(Math.random() * 500),
    sslValid: formattedUrl.startsWith('https://') && Math.random() > 0.2,
    redirectCount: Math.floor(Math.random() * 4),
    details: {
      phishingDetected: hasPhishing,
      malwareRisk: hasMalware,
      suspiciousDomain: isSuspiciousDomain,
      redirectChain: formattedUrl.startsWith('https://') ? 
        [formattedUrl, formattedUrl + '/redirect'] : 
        [formattedUrl],
      domainAge: Math.random() > 0.3 ? '3 years' : '2 days',
      hostingProvider: Math.random() > 0.5 ? 'AWS' : 'Unknown Provider',
    }
  };
  
  // Calculate security score
  const securityScore = calculateSecurityScore(result);
  
  // Determine overall status based on score
  let status: 'safe' | 'warning' | 'danger' | 'unknown';
  if (securityScore >= 80) {
    status = 'safe';
  } else if (securityScore >= 50) {
    status = 'warning';
  } else {
    status = 'danger';
  }
  
  // Return complete result
  return {
    ...result,
    status,
    securityScore,
    checkedAt: new Date(),
  } as VerificationResult;
};

// Format relative time (e.g., "2 minutes ago")
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
};