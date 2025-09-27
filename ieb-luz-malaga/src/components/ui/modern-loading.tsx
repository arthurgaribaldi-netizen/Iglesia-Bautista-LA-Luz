"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ModernLoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function ModernLoading({ size = 'md', text, className = '' }: ModernLoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className={`${sizeClasses[size]} border-4 border-amber-200 dark:border-amber-800 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner ring */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-amber-500 rounded-full`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-amber-500 rounded-full" />
        </motion.div>
      </div>
      
      {text && (
        <motion.p
          className={`text-gray-600 dark:text-gray-400 font-medium ${textSizes[size]}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Page loading component
export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-amber-950 dark:via-orange-950 dark:to-amber-900">
      <div className="text-center">
        <ModernLoading size="lg" text="Cargando..." />
        <motion.div
          className="mt-8 text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          IEB La Luz
        </motion.div>
      </div>
    </div>
  );
}

// Inline loading component
export function InlineLoading({ text = "Cargando..." }: { text?: string }) {
  return (
    <div className="flex items-center gap-3 py-4">
      <ModernLoading size="sm" />
      <span className="text-gray-600 dark:text-gray-400">{text}</span>
    </div>
  );
}

// Button loading state
export function ButtonLoading() {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <span>Cargando...</span>
    </div>
  );
}

// Skeleton loading components
export function SkeletonCard() {
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-3xl p-8 shadow-2xl">
      <div className="space-y-4">
        <motion.div
          className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className={`h-4 bg-gray-200 dark:bg-gray-700 rounded-lg ${
            index === lines - 1 ? 'w-2/3' : 'w-full'
          }`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            delay: index * 0.2, 
          }}
        />
      ))}
    </div>
  );
}
