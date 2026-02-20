import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://mustafatetik.com"),
  title: "Mustafa Tetik - Computer Engineering Student",
  description:
    "Personal portfolio of Mustafa Tetik, a passionate computer engineering student who is eager to improve himself.",
  keywords: ["developer", "portfolio", "react", "nextjs", "typescript", "backend", "springboot"],
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
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Mustafa Tetik Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mustafa Tetik - Computer Engineering Student",
    description:
      "Personal portfolio of Mustafa Tetik, a passionate computer engineering student who is eager to improve himself.",
    images: ["/logo.png"],
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
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark overflow-x-hidden" suppressHydrationWarning>
      <body className={`${inter.className} overflow-x-hidden w-full`}>
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  )
}
