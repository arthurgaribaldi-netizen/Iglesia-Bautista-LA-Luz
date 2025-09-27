import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './ssr-animations.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IEB La Luz Málaga - Iglesia Evangélica Bautista',
  description: 'Iglesia Evangélica Bautista La Luz en Málaga. Una comunidad de fe donde puedes crecer espiritualmente y conectar con otros creyentes. Cultos dominicales, escuela bíblica y ministerios activos.',
  keywords: 'iglesia bautista, iglesia evangélica, Málaga, España, cultos dominicales, escuela bíblica, comunidad cristiana, fe, adoración',
  authors: [{ name: 'IEB La Luz Málaga' }],
  creator: 'IEB La Luz Málaga',
  publisher: 'IEB La Luz Málaga',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ieblaluzmalaga.es'),
  alternates: {
    canonical: '/',
    languages: {
      'es-ES': '/',
      'pt-PT': '/',
    },
  },
  openGraph: {
    title: 'IEB La Luz Málaga - Iglesia Evangélica Bautista',
    description: 'Una comunidad de fe en Málaga donde puedes crecer espiritualmente y conectar con otros creyentes.',
    url: 'https://ieblaluzmalaga.es',
    siteName: 'IEB La Luz Málaga',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'IEB La Luz Málaga - Iglesia Evangélica Bautista',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IEB La Luz Málaga - Iglesia Evangélica Bautista',
    description: 'Una comunidad de fe en Málaga donde puedes crecer espiritualmente y conectar con otros creyentes.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}