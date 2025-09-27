import { logger } from './logger';

interface AlertConfig {
  type: 'error' | 'performance' | 'security' | 'uptime'
  threshold: number
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

const alertConfigs: AlertConfig[] = [
  {
    type: 'performance',
    threshold: 2.5,
    message: 'LCP exceeded threshold',
    severity: 'high',
  },
  {
    type: 'error',
    threshold: 10,
    message: 'High error rate detected',
    severity: 'critical',
  },
  {
    type: 'uptime',
    threshold: 99.5,
    message: 'Uptime below threshold',
    severity: 'critical',
  },
];

export function checkAlerts(metrics: any) {
  alertConfigs.forEach(config => {
    let value = 0;
    
    switch (config.type) {
      case 'performance':
        value = metrics.performance?.lcp || 0;
        break;
      case 'error':
        value = metrics.errors?.total || 0;
        break;
      case 'uptime':
        value = metrics.uptime?.current || 100;
        break;
    }

    const shouldAlert = config.type === 'uptime' 
      ? value < config.threshold 
      : value > config.threshold;

    if (shouldAlert) {
      logger.error(`ALERT: ${config.message}`, {
        type: config.type,
        severity: config.severity,
        value,
        threshold: config.threshold,
        timestamp: new Date().toISOString(),
      });

      // Send to Sentry
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureMessage(config.message, {
          level: config.severity === 'critical' ? 'error' : 'warning',
          tags: {
            alertType: config.type,
            severity: config.severity,
          },
          extra: {
            value,
            threshold: config.threshold,
          },
        });
      }
    }
  });
}
