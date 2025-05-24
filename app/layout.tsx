import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mustafa Tetik - Computer Engineering Student",
  description:
    "Personal portfolio of Mustafa Tetik, a passionate computer engineering student who is eager to improve himself.",
  keywords: ["developer", "portfolio", "react", "nextjs", "typescript", "backend","springboot"],
  authors: [{ name: "Mustafa Tetik" }],
  creator: "Mustafa Tetik",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mustafatetik.com",
    title: "Mustafa Tetik - Computer Engineering Student",
    description:
      "Personal portfolio of Mustafa Tetik, a passionate computer engineering student who is eager to improve himself.",
    siteName: "Mustafa Tetik Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mustafa Tetik Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mustafa Tetik - Computer Engineering Student",
    description:
      "Personal portfolio of Mustafa Tetik, a passionate computer engineering student who is eager to improve himself.",
    images: ["/og-image.jpg"],
    creator: "@mustafatetik",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 ml-64 transition-all duration-300 ease-in-out">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
