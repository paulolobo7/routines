import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from 'next-themes'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : new URL('http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: 'Routines - Timer Pomodoro e organizacao de tarefas',
  description: 'Central de foco com timer Pomodoro, planejamento de tarefas e estatisticas locais de produtividade.',
  keywords: ['pomodoro', 'timer', 'tarefas', 'produtividade', 'foco', 'relatórios'],
  authors: [{ name: 'Paulo Lobo' }],
  creator: 'Paulo Lobo',
  openGraph: {
    title: 'Routines - Timer Pomodoro e organizacao de tarefas',
    description: 'Timer Pomodoro com gerenciamento de tarefas, configuracoes e estatisticas persistidas localmente.',
    url: siteUrl,
    siteName: 'Routines',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Routines - central de foco com timer Pomodoro',
      },
    ],
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Routines - Timer Pomodoro e organizacao de tarefas',
    description: 'Central de foco com timer Pomodoro, tarefas e estatisticas locais.',
    images: ['/opengraph-image'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f8fb' },
    { media: '(prefers-color-scheme: dark)', color: '#151821' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
