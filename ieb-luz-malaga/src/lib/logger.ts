/**
 * Production-safe logging utility
 * Automatically disables console.log statements in production builds
 */

type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

interface LoggerConfig {
  enableInProduction?: boolean;
  prefix?: string;
}

class Logger {
  private config: LoggerConfig;
  private isDevelopment: boolean;

  constructor(config: LoggerConfig = { enableInProduction: false }) {
    this.config = { enableInProduction: false, ...config };
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private shouldLog(): boolean {
    return this.isDevelopment || Boolean(this.config.enableInProduction);
  }

  private formatMessage(level: LogLevel, ...args: any[]): any[] {
    const prefix = this.config.prefix ? `[${this.config.prefix}]` : '';
    return prefix ? [`${prefix}`, ...args] : args;
  }

  log(...args: any[]): void {
    if (this.shouldLog()) {
      console.log(...this.formatMessage('log', ...args));
    }
  }

  info(...args: any[]): void {
    if (this.shouldLog()) {
      console.info(...this.formatMessage('info', ...args));
    }
  }

  warn(...args: any[]): void {
    if (this.shouldLog()) {
      console.warn(...this.formatMessage('warn', ...args));
    }
  }

  error(...args: any[]): void {
    // Always log errors, even in production
    console.error(...this.formatMessage('error', ...args));
  }

  debug(...args: any[]): void {
    if (this.shouldLog()) {
      console.debug(...this.formatMessage('debug', ...args));
    }
  }

  // Performance monitoring
  time(label: string): void {
    if (this.shouldLog()) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.shouldLog()) {
      console.timeEnd(label);
    }
  }

  // Component loading performance
  logComponentLoad(componentName: string, loadTime: number, priority?: string): void {
    if (this.shouldLog()) {
      const priorityText = priority ? ` (${priority} priority)` : '';
      console.log(`📊 ${componentName} loaded in ${loadTime.toFixed(2)}ms${priorityText}`);
    }
  }

  // Service Worker logging
  logServiceWorker(message: string, data?: any): void {
    if (this.shouldLog()) {
      console.log(`🔧 Service Worker: ${message}`, data || '');
    }
  }

  // PWA logging
  logPWA(message: string, data?: any): void {
    if (this.shouldLog()) {
      console.log(`📱 PWA: ${message}`, data || '');
    }
  }

  // Build configuration logging
  logBuildConfig(config: Record<string, any>): void {
    if (this.shouldLog()) {
      console.log('🔧 Build Configuration:', config);
    }
  }
}

// Default logger instances
export const logger = new Logger({ enableInProduction: false });
export const componentLogger = new Logger({ enableInProduction: false, prefix: 'Component' });
export const serviceWorkerLogger = new Logger({ enableInProduction: false, prefix: 'ServiceWorker' });
export const pwaLogger = new Logger({ enableInProduction: false, prefix: 'PWA' });
export const buildLogger = new Logger({ enableInProduction: false, prefix: 'Build' });

// Performance logger that can be enabled in production for monitoring
export const performanceLogger = new Logger({ 
  enableInProduction: true,
  prefix: 'Performance' 
});

export default Logger;