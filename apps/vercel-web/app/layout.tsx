import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Realest',
  description: 'Vercel-native Realest migration',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
