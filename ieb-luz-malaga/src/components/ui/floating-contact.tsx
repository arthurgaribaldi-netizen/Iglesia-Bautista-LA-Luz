"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, X, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { useIsClient } from '@/hooks/use-is-client';

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;
    
    // Show floating button after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isClient]);

  const contactOptions = [
    {
      icon: Phone,
      label: "Llamar",
      href: "tel:+34952230400",
      color: "bg-green-500 hover:bg-green-600",
      delay: 0.1,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: "https://wa.me/34952230400",
      color: "bg-green-600 hover:bg-green-700",
      delay: 0.2,
    },
    {
      icon: MapPin,
      label: "Ubicación",
      href: "/contato",
      color: "bg-blue-500 hover:bg-blue-600",
      delay: 0.3,
    },
    {
      icon: Clock,
      label: "Horarios",
      href: "/eventos",
      color: "bg-purple-500 hover:bg-purple-600",
      delay: 0.4,
    },
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mb-4 space-y-3"
          >
            {contactOptions.map((option, index) => (
              <motion.div
                key={option.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: option.delay }}
              >
                <motion.a
                  href={option.href}
                  target={option.href.startsWith('http') ? '_blank' : undefined}
                  rel={option.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full text-white shadow-lg ${option.color} transition-all duration-300`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <option.icon className="w-5 h-5" />
                  <span className="font-medium">{option.label}</span>
                </motion.a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20, 
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="phone"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Phone className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Pulse animation for attention */}
      {!isOpen && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-500"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ zIndex: -1 }}
        />
      )}
    </div>
  );
}

// Mobile-optimized contact banner
export function MobileContactBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;
    
    const checkScroll = () => {
      const scrolled = window.scrollY > 500;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, [isClient]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 z-40 md:hidden"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">¿Necesitas ayuda?</h3>
          <p className="text-sm opacity-90">Estamos aquí para ti</p>
        </div>
        <div className="flex gap-2">
          <motion.a
            href="tel:+34952230400"
            className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Llamar
          </motion.a>
          <motion.a
            href="/contato"
            className="px-4 py-2 bg-white text-amber-600 rounded-full text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contacto
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
