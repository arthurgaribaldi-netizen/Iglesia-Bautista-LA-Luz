import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './ssr-animations.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Igreja Bautista La Luz - Málaga',
  description: 'Uma comunidade cristã vibrante em Málaga, Espanha',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>{children}</body>
    </html>
  )
}