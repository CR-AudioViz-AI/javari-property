import Script from 'next/script';
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import EcosystemNav from '@/components/ecosystem/EcosystemNav'
import EcosystemFooter from '@/components/ecosystem/EcosystemFooter'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CR Property Management | AI-Powered Property Management',
  description: 'Part of the CR AudioViz AI creative ecosystem',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} min-h-screen min-h-[100dvh]`}>
        <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-gray-50 to-gray-100">
          <EcosystemNav appName="Javari Property" />{children}<EcosystemFooter />
        </div>
        <Script src="https://javariai.com/embed.js" strategy="lazyOnload" />
      <footer style={{background:"#040912",padding:"12px 20px",textAlign:"center",fontFamily:"system-ui"}}>
          <p style={{color:"#374151",fontSize:11,margin:0}}>© 2026 CR AudioViz AI, LLC — EIN: 39-3646201 · <a href="https://craudiovizai.com/auth/signup" style={{color:"#FF0800",textDecoration:"none",fontWeight:600}}>Sign Up Free</a></p>
        </footer>
      </body>
    </html>
  )
}
