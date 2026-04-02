import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Header from './components/Header'
import CustomCursor from './components/CustomCursor'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL('https://rudamachorugby.netlify.app'),
  title: 'Ruda Macho Rugby Club',
  description: 'Club de Rugby Inclusivo - Nuestra Lucha es Jugando. Más que un club, somos una familia unida por la pasión del rugby.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/icons/icon-192x192.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ruda Macho',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Ruda Macho Rugby Club',
    description: 'Club de Rugby Inclusivo - Nuestra Lucha es Jugando',
    images: ['/assets/Logo Ruda Macho.png'],
    type: 'website',
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ruda Macho Rugby Club',
    description: 'Club de Rugby Inclusivo - Nuestra Lucha es Jugando',
    images: ['/assets/Logo Ruda Macho.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1B5E20',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ruda Macho" />
        <meta name="application-name" content="Ruda Macho" />
        <meta name="msapplication-TileColor" content="#1B5E20" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <CustomCursor />
        <ThemeProvider>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
