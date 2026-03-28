import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { TRPCProvider } from "@/components/providers"
import { Toaster } from "sonner"
import { WhatsAppWidget } from "@/components/WhatsAppWidget"
import { PwaProvider } from "@/components/PwaProvider"
import { defaultMetadata } from "@/lib/metadata"
import "./globals.css"

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/ITC Avant Garde Gothic PRO Font Family/ITC Avant Garde Gothic Pro-Book.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Montserrat/Montserrat-VariableFont_wght.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Pixel-operator/PixelOperator-Bold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Mulish/Mulish-VariableFont_wght.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased">
        <PwaProvider>
          <TRPCProvider>
            {children}
            <WhatsAppWidget />
            <Analytics />
            <Toaster />
          </TRPCProvider>
        </PwaProvider>
      </body>
    </html>
  )
}
