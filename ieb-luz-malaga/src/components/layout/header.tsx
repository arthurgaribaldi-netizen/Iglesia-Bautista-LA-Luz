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
    <motion.header 
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-blue-200/30 dark:border-blue-800/30' 
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-blue-200/20 dark:border-blue-800/20 shadow-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link 
              href="/" 
              className="focus:outline-none focus:ring-2 focus:ring-church-primary focus:ring-offset-2 rounded-md p-1"
              aria-label="IEB La Luz Málaga - Ir para página inicial"
            >
              <ChurchLogoCompact />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden nav:flex items-center space-x-2" role="navigation" aria-label="Navegação principal">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="relative text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-950/20 group"
                  aria-label={`Ir para ${item.name}`}
                >
                  <span className="relative z-10">{item.name}</span>
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* CTA Button and Theme Toggle */}
          <div className="hidden sm-md:flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ThemeToggle />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 text-sm font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300" 
                asChild
              >
                <Link href="/contato">
                  <span className="mr-2">💒</span>
                  Visite-nos
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="nav:hidden"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              id="mobile-menu"
              className="nav:hidden"
              role="navigation"
              aria-label="Menu de navegação móvel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-blue-200/20 dark:border-blue-800/20">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                      onClick={closeMenu}
                      aria-label={`Ir para ${item.name}`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div 
                  className="px-3 py-2 space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <div className="flex justify-center">
                    <ThemeToggle />
                  </div>
                  <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                    <Link href="/contato" aria-label="Ir para página de contato">
                      <span className="mr-2">💒</span>
                      Visite-nos
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
