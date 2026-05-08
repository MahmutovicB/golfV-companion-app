import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register"
import { IosInstallPrompt } from "@/components/pwa/ios-install-prompt"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })

export const metadata: Metadata = {
  title: "Golf BKC Companion",
  description: "Personal companion app for VW Golf 5 1.9 TDI BKC",
  appleWebApp: {
    capable: true,
    title: "BKC",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} dark`}>
      <body className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased">
        <ServiceWorkerRegister />
        <IosInstallPrompt />
        {children}
      </body>
    </html>
  )
}
