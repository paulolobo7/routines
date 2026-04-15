import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  title: 'Routines — Timer Pomodoro & Organização de Tarefas',
  description: 'Organize seu tempo e aumente sua produtividade com o Routines, o aplicativo definitivo.',
  keywords: ['pomodoro', 'timer', 'tarefas', 'produtividade', 'foco', 'relatórios'],
  authors: [{ name: 'Paulo Lobo', url: 'https://paulolobo.dev' }],
  creator: 'Paulo Lobo',
  openGraph: {
    title: 'Routines — Timer Pomodoro & Organização de Tarefas',
    description: 'Timer Pomodoro com gerenciamento de tarefas e estatísticas em tempo real.',
    url: 'https://routines.paulolobo.dev',
    siteName: 'Routines',
    images: [
      {
        url: '/favicon.png',
        width: 1200,
        height: 630,
        alt: 'Routines - Timer Pomodoro & Organização de Tarefas',
      },
    ],
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Routines — Timer Pomodoro & Organização de Tarefas',
    description: 'Timer Pomodoro com gerenciamento de tarefas e estatísticas em tempo real.',
    images: ['/favicon.png'],
    creator: '@paulolobo7',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
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
