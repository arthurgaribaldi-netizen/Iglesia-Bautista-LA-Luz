import React from 'react';

interface SSRModernCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  [key: string]: any;
}

/**
 * SSR-Compatible Modern Card Component
 * Uses CSS-only animations and hover effects
 */
export function SSRModernCard({ 
  children, 
  className = "", 
  hoverEffect = true,
  ...props 
}: SSRModernCardProps) {
  const hoverClasses = hoverEffect 
    ? "hover:scale-102 hover:-translate-y-1 hover:shadow-3xl transition-all duration-300" 
    : "";

  return (
    <div
      className={`
        bg-white/90 dark:bg-gray-800/90 
        backdrop-blur-xl 
        border border-white/20 dark:border-gray-700/20 
        rounded-3xl p-8 
        shadow-2xl 
        animate-scale-in
        ${hoverClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
