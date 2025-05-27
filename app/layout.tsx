import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { SidebarProvider } from "@/components/sidebar-context"
import { MainLayout } from "@/components/main-layout"
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
  generator: 'v0.dev',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <Sidebar />
            <MainLayout>{children}</MainLayout>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
