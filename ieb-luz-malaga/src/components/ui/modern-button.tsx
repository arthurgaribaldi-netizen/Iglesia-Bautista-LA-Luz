import React from 'react';
import { cn } from '@/lib/utils';

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function ModernButton({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ModernButtonProps) {
  const baseClasses = "font-modern font-medium rounded-lg transition-all duration-300 transform focus:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "gradient-yellow-orange text-church-gray shadow-md hover:shadow-lg hover:scale-105 focus:ring-church-accent",
    secondary: "bg-church-blue text-white hover:bg-church-blue-light shadow-md hover:shadow-lg hover:scale-105 focus:ring-church-blue",
    accent: "bg-church-gray text-white hover:bg-church-gray/90 shadow-md hover:shadow-lg hover:scale-105 focus:ring-church-gray",
    outline: "border-2 border-church-accent text-church-gray hover:bg-church-accent hover:text-church-gray focus:ring-church-accent",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

