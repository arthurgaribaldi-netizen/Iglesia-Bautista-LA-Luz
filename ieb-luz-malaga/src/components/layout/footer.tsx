import Link from "next/link";
import { Church, MapPin, Phone, Mail, Clock, Facebook, Youtube, Heart, Star } from "lucide-react";
import { NewsletterSignupCompact } from "@/components/lazy/lazy-newsletter-signup";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-t border-amber-200/20 dark:border-amber-800/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 tablet-sm:grid-cols-2 tablet-md:grid-cols-3 tablet-lg:grid-cols-4 tablet-xl:grid-cols-6 gap-8">
          {/* Church Info */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Church className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </motion.div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">IEB La Luz</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Iglesia Evangélica Bautista La Luz Málaga
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              CIF: R2900286B<br />
              Ministerio de Justicia e FEREDE nº 016332
            </p>
          </motion.div>

          {/* Horarios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Horarios</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">Domingo</p>
                  <p className="text-muted-foreground">Estudio Bíblico: 11:00</p>
                  <p className="text-muted-foreground">Culto: 18:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  Avenida Antonio Gaudí, 4, Málaga
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">+34 952 23 04 00</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enlaces</h3>
            <div className="space-y-2 text-sm">
              <Link href="/sobre" className="block text-muted-foreground hover:text-primary">
                Sobre Nosotros
              </Link>
              <Link href="/sermoes" className="block text-muted-foreground hover:text-primary">
                Sermões
              </Link>
              <Link href="/eventos" className="block text-muted-foreground hover:text-primary">
                Eventos
              </Link>
              <Link href="/contato" className="block text-muted-foreground hover:text-primary">
                Contacto
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Síguenos</h3>
            <div className="space-y-3">
              <motion.a 
                href="https://www.facebook.com/people/Iglesia-Evang%C3%A9lica-Bautista-La-Luz/100069447056296" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white group-hover:bg-blue-700 transition-colors"
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Facebook className="h-5 w-5" />
                </motion.div>
                <div>
                  <p className="font-medium text-sm">Facebook</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Únete a nuestra comunidad</p>
                </div>
              </motion.a>
              
              <motion.a 
                href="https://www.youtube.com/channel/UCiahUfyUv3VbwrMjgLh-WzA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-white group-hover:bg-red-700 transition-colors"
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Youtube className="h-5 w-5" />
                </motion.div>
                <div>
                  <p className="font-medium text-sm">YouTube</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Sermones y contenido</p>
                </div>
              </motion.a>
            </div>
          </motion.div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <NewsletterSignupCompact 
              priority="low"
              delay={500}
            />
          </div>
        </div>

        <motion.div 
          className="border-t border-amber-200/20 dark:border-amber-800/20 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            &copy; 2024 IEB La Luz Málaga. Todos los derechos reservados.
            <Star className="w-4 h-4 text-yellow-500" />
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
