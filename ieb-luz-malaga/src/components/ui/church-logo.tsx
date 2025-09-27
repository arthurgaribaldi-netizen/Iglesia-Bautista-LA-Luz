import React from 'react';
import { cn } from '@/lib/utils';

interface ChurchLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only';
}

export function ChurchLogo({ 
  className, 
  showText = true, 
  size = 'md',
  variant = 'full',
}: ChurchLogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const logoIcon = (
    <div className={cn('relative', sizeClasses[size])}>
      {/* Overlapping rectangles background */}
      <div className="absolute inset-0">
        {/* Left rectangle - dark orange/brown */}
        <div 
          className="absolute w-8 h-8 -rotate-12 -translate-x-1 -translate-y-1 rounded-sm"
          style={{ backgroundColor: 'hsl(var(--church-primary))' }}
        />
        {/* Center rectangle - warm yellow */}
        <div 
          className="absolute w-8 h-8 -rotate-6 translate-x-1 translate-y-1 rounded-sm"
          style={{ backgroundColor: 'hsl(var(--church-accent))' }}
        />
        {/* Right rectangle - warm yellow */}
        <div 
          className="absolute w-8 h-8 rotate-3 translate-x-3 translate-y-2 rounded-sm"
          style={{ backgroundColor: 'hsl(var(--church-accent))' }}
        />
      </div>
      
      {/* Cross */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Vertical line */}
          <div 
            className="absolute w-0.5 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: 'hsl(var(--church-white))' }}
          />
          {/* Horizontal line */}
          <div 
            className="absolute w-6 h-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: 'hsl(var(--church-white))' }}
          />
        </div>
      </div>
    </div>
  );

  if (variant === 'icon-only' || !showText) {
    return (
      <div className={cn('inline-flex items-center justify-center', className)}>
        {logoIcon}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      {logoIcon}
      
      <div className="flex flex-col">
        <span className={cn('font-body font-semibold text-foreground leading-tight', textSizeClasses[size])}>
          IGLESIA EVANGÉLICA BAUTISTA
        </span>
        <div className="relative">
          <span className={cn('font-display font-bold text-foreground leading-tight', textSizeClasses[size])}>
            LA LUZ
          </span>
          {/* Glowing light effect */}
          <div 
            className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full opacity-60 blur-sm"
            style={{ 
              background: `linear-gradient(90deg, transparent, hsl(var(--church-accent)), transparent)`,
            }}
          />
        </div>
        <span className={cn('font-body text-foreground leading-tight', textSizeClasses[size])}>
          Málaga - España
        </span>
      </div>
    </div>
  );
}

// Simplified version for smaller spaces
export function ChurchLogoCompact({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* Icon only version */}
      <div className="w-8 h-8 relative">
        {/* Overlapping rectangles */}
        <div className="absolute inset-0">
          <div 
            className="absolute w-5 h-5 -rotate-12 -translate-x-0.5 -translate-y-0.5 rounded-sm"
            style={{ backgroundColor: 'hsl(var(--church-primary))' }}
          />
          <div 
            className="absolute w-5 h-5 -rotate-6 translate-x-0.5 translate-y-0.5 rounded-sm"
            style={{ backgroundColor: 'hsl(var(--church-accent))' }}
          />
          <div 
            className="absolute w-5 h-5 rotate-3 translate-x-2 translate-y-1 rounded-sm"
            style={{ backgroundColor: 'hsl(var(--church-accent))' }}
          />
        </div>
        
        {/* Cross */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div 
              className="absolute w-0.5 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ backgroundColor: 'hsl(var(--church-white))' }}
            />
            <div 
              className="absolute w-4 h-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ backgroundColor: 'hsl(var(--church-white))' }}
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-sm font-display font-bold text-foreground leading-tight">
          IEB La Luz
        </span>
        <span className="text-xs font-body text-foreground leading-tight">
          Málaga
        </span>
      </div>
    </div>
  );
}
