"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Hover effect with subtle scale and shadow
export interface HoverCardProps {
  children: React.ReactNode
  className?: string
  scale?: boolean
  shadow?: boolean
}

export const HoverCard = React.forwardRef<HTMLDivElement, HoverCardProps>(
  ({ children, className, scale = true, shadow = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "transition-all duration-300 ease-out",
          scale && "hover:scale-105",
          shadow && "hover:shadow-lg hover:shadow-black/10",
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

HoverCard.displayName = "HoverCard";

// Pulse animation for loading states
export interface PulseProps {
  children: React.ReactNode
  className?: string
  active?: boolean
}

export const Pulse = React.forwardRef<HTMLDivElement, PulseProps>(
  ({ children, className, active = false }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "transition-all duration-300",
          active && "animate-pulse",
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

Pulse.displayName = "Pulse";

// Shake animation for error states
export interface ShakeProps {
  children: React.ReactNode
  className?: string
  active?: boolean
}

export const Shake = React.forwardRef<HTMLDivElement, ShakeProps>(
  ({ children, className, active = false }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "transition-all duration-300",
          active && "animate-shake",
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

Shake.displayName = "Shake";

// Fade in animation
export interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}

export const FadeIn = React.forwardRef<HTMLDivElement, FadeInProps>(
  ({ children, className, delay = 0, duration = 300 }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    return (
      <div
        ref={ref}
        className={cn(
          "transition-all ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          className,
        )}
        style={{ transitionDuration: `${duration}ms` }}
      >
        {children}
      </div>
    );
  },
);

FadeIn.displayName = "FadeIn";

// Ripple effect for buttons
export interface RippleProps {
  children: React.ReactNode
  className?: string
  color?: string
}

export const RippleButton = React.forwardRef<HTMLButtonElement, RippleProps & React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, className, color = "rgba(255, 255, 255, 0.6)", onClick, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);

    const addRipple = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const newRipple = { x, y, id: Date.now() };

      setRipples(prev => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);

      // Call the original onClick if provided
      if (onClick) {
        onClick(event);
      }
    }, [onClick]);

    return (
      <button
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        onClick={addRipple}
        {...props}
      >
        {children}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute pointer-events-none rounded-full animate-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              backgroundColor: color,
              transform: "translate(-50%, -50%)",
              animation: "ripple 0.6s linear",
            }}
          />
        ))}
      </button>
    );
  },
);

RippleButton.displayName = "RippleButton";

// Success checkmark animation
export interface SuccessCheckProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export const SuccessCheck = React.forwardRef<HTMLDivElement, SuccessCheckProps>(
  ({ size = "md", className }, ref) => {
    const sizeClasses = {
      sm: "w-6 h-6",
      md: "w-8 h-8",
      lg: "w-12 h-12",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full bg-green-500 text-white",
          sizeClasses[size],
          className,
        )}
      >
        <svg
          className="w-3/4 h-3/4 animate-checkmark"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            className="stroke-dasharray-24 stroke-dashoffset-24 animate-draw-checkmark"
            d="M20 6L9 17l-5-5"
          />
        </svg>
      </div>
    );
  },
);

SuccessCheck.displayName = "SuccessCheck";

// Loading spinner with customizable colors
export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: string
  className?: string
}

export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size = "md", color = "text-primary", className }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin rounded-full border-2 border-gray-300 border-t-current",
          sizeClasses[size],
          color,
          className,
        )}
      />
    );
  },
);

LoadingSpinner.displayName = "LoadingSpinner";
