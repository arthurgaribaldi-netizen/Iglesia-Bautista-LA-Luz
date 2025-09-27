"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsClient } from '@/hooks/use-is-client';

// Modern Ripple Effect Component
export function RippleButton({ 
  children, 
  className = "", 
  onClick, 
  ...props 
}: {
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
  [key: string]: any
}) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    onClick?.(e);
  };

  return (
    <button
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            initial={{ width: 0, height: 0, x: ripple.x, y: ripple.y }}
            animate={{ 
              width: 300, 
              height: 300, 
              x: ripple.x - 150, 
              y: ripple.y - 150,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </button>
  );
}

// Modern Card with Hover Effects
export function ModernCard({ 
  children, 
  className = "", 
  hoverEffect = true,
  ...props 
}: {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
  [key: string]: any
}) {
  return (
    <motion.div
      className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-3xl p-8 shadow-2xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={hoverEffect ? { 
        scale: 1.02, 
        y: -5,
        transition: { duration: 0.3 },
      } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Floating Action Button
export function FloatingActionButton({ 
  children, 
  onClick, 
  className = "",
  position = "bottom-right", 
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
}) {
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  return (
    <motion.button
      className={`fixed ${positionClasses[position]} z-50 w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-2xl hover:shadow-amber-500/25 flex items-center justify-center text-white ${className}`}
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20, 
      }}
    >
      {children}
    </motion.button>
  );
}

// Modern Loading Spinner
export function ModernSpinner({ 
  size = "md", 
  color = "amber", 
}: {
  size?: "sm" | "md" | "lg"
  color?: "amber" | "blue" | "green" | "purple"
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
  };

  const colorClasses = {
    amber: "text-amber-500",
    blue: "text-blue-500",
    green: "text-green-500",
    purple: "text-purple-500",
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${colorClasses[color]}`}
      animate={{ rotate: 360 }}
      transition={{ 
        duration: 1, 
        repeat: Infinity, 
        ease: "linear", 
      }}
    >
      <svg className="w-full h-full" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="60"
          strokeDashoffset="60"
        />
      </svg>
    </motion.div>
  );
}

// Modern Progress Bar
export function ModernProgressBar({ 
  progress, 
  className = "",
  showPercentage = true, 
}: {
  progress: number
  className?: string
  showPercentage?: boolean
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Progresso
        </span>
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// Modern Tooltip
export function ModernTooltip({ 
  children, 
  content, 
  position = "top", 
}: {
  children: React.ReactNode
  content: string
  position?: "top" | "bottom" | "left" | "right"
}) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900",
    bottom: "bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900",
    left: "left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900",
    right: "right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900",
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg ${positionClasses[position]}`}
          >
            {content}
            <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Modern Notification Toast
export function ModernToast({ 
  message, 
  type = "info", 
  isVisible, 
  onClose, 
}: {
  message: string
  type?: "success" | "error" | "warning" | "info"
  isVisible: boolean
  onClose: () => void
}) {
  const typeClasses = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white", 
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-500 text-white",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 ${typeClasses[type]}`}
        >
          <span className="text-xl">{icons[type]}</span>
          <span className="font-medium">{message}</span>
          <button
            onClick={onClose}
            className="ml-2 text-white/80 hover:text-white transition-colors"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Modern Scroll Indicator
export function ModernScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;
    
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, [isClient]);

  if (!isClient) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
        style={{ width: `${scrollProgress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}

// Modern Parallax Container
export function ModernParallaxContainer({ 
  children, 
  speed = 0.5,
  className = "", 
}: {
  children: React.ReactNode
  speed?: number
  className?: string
}) {
  const [offset, setOffset] = useState(0);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;
    
    const handleScroll = () => {
      setOffset(window.scrollY * speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, isClient]);

  if (!isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div 
      className={`relative ${className}`}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  );
}
