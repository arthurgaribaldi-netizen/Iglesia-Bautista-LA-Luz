"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChurchLogoCompact } from "@/components/ui/church-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, X, Phone, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // 2025 Simplified Navigation - Only 5 essential items as recommended
  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Sobre", href: "/sobre" },
    { name: "Cultos", href: "/transmissoes" },
    { name: "Eventos", href: "/eventos" },
    { name: "Contato", href: "/contato" },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-blue-200/30 dark:border-blue-800/30' 
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-blue-200/20 dark:border-blue-800/20 shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <div>
            <Link 
              href="/" 
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
              aria-label="IEB La Luz Málaga - Ir para página inicial"
            >
              <ChurchLogoCompact />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Navegação principal">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                aria-label={`Ir para ${item.name}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
              asChild
            >
              <Link href="/contato">
                <span className="mr-2">💒</span>
                Visite-nos
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden"
            role="navigation"
            aria-label="Menu de navegação móvel"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-blue-200/20 dark:border-blue-800/20">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                  onClick={closeMenu}
                  aria-label={`Ir para ${item.name}`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/contato" aria-label="Ir para página de contato">
                    <span className="mr-2">💒</span>
                    Visite-nos
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
