import { checkAlerts } from '@/lib/alerts';
import logger from '@/lib/logger';

describe('Alert System', () => {
  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('should trigger performance alert for high LCP', () => {
    const metrics = {
      performance: { lcp: 3.0 },
      errors: { total: 5 },
      uptime: { current: 99.9 },
    };

    checkAlerts(metrics);
    expect(logger.error).toHaveBeenCalledWith(
      'ALERT: LCP exceeded threshold',
      expect.objectContaining({
        type: 'performance',
        severity: 'high',
        value: 3.0,
        threshold: 2.5,
        timestamp: expect.any(String),
      })
    );
  });

  it('should trigger error alert for high error count', () => {
    const metrics = {
      performance: { lcp: 2.0 },
      errors: { total: 15 },
      uptime: { current: 99.9 },
    };

    checkAlerts(metrics);
    expect(logger.error).toHaveBeenCalledWith(
      'ALERT: High error rate detected',
      expect.objectContaining({
        type: 'error',
        severity: 'critical',
        value: 15,
        threshold: 10,
        timestamp: expect.any(String),
      })
    );
  });

  it('should trigger uptime alert for low uptime', () => {
    const metrics = {
      performance: { lcp: 2.0 },
      errors: { total: 5 },
      uptime: { current: 99.0 },
    };

    checkAlerts(metrics);
    expect(logger.error).toHaveBeenCalledWith(
      'ALERT: Uptime below threshold',
      expect.objectContaining({
        type: 'uptime',
        severity: 'critical',
        value: 99.0,
        threshold: 99.5,
        timestamp: expect.any(String),
      })
    );
  });

  it('should not trigger alerts for good metrics', () => {
    const metrics = {
      performance: { lcp: 2.0 },
      errors: { total: 5 },
      uptime: { current: 99.9 },
    };

    checkAlerts(metrics);
    expect(logger.error).not.toHaveBeenCalled();
  });
});
