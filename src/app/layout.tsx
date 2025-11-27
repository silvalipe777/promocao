import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { NotificationPrompt } from '@/components/NotificationPrompt'
import { ScrollToTop } from '@/components/ScrollToTop'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PromoHunt Brasil - As Melhores Promoções do Telegram',
  description: 'Descubra as melhores ofertas e promoções do Brasil em tempo real, capturadas diretamente dos grupos do Telegram.',
  keywords: 'promoções, ofertas, cupons, descontos, Brasil, Shopee, Amazon, Mercado Livre',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <NotificationPrompt />
            <ScrollToTop />
          </div>
        </Providers>
      </body>
    </html>
  )
}
