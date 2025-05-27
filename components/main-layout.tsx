"use client"

import { ReactNode } from "react"
import { useSidebar } from "./sidebar-context"
import { motion } from "framer-motion"

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isOpen } = useSidebar()

  return (
    <motion.main
      initial={false}
      animate={{
        marginLeft: isOpen ? "0" : "0",
        paddingLeft: isOpen ? "1rem" : "4rem",
      }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-16 md:pt-16 relative z-30 md:ml-64"
    >
      {children}
    </motion.main>
  )
} 