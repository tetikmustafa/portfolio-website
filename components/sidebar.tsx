"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Home, User, FolderOpen, Mail, Moon, Sun, Github, Linkedin, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: User },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Contact", href: "/contact", icon: Mail },
]

export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { isOpen, setIsOpen } = useSidebar()

  useEffect(() => {
    setMounted(true)
    setIsOpen(false)
  }, [])

  if (!mounted) {
    return null
  }


  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Overlay for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.2 }
              }}
              className="fixed left-0 top-0 z-50 h-full w-72 bg-card/80 backdrop-blur-sm border-r border-border shadow-lg md:bg-card"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.2 }}
                        className="text-xl font-bold text-foreground"
                      >
                        Mustafa Tetik
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.2 }}
                        className="text-sm text-muted-foreground mt-1"
                      >
                        Computer Engineering Student
                      </motion.p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(!isOpen)}
                      aria-label="Toggle sidebar"
                      className="shrink-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                  <ul className="space-y-2">
                    {navigation.map((item, index) => {
                      const isActive = pathname === item.href
                      return (
                        <motion.li
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: 0.1 + index * 0.05,
                            duration: 0.2,
                            ease: "easeOut"
                          }}
                        >
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
                              isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground",
                            )}
                            onClick={() => {
                              if (window.innerWidth < 768) {
                                setIsOpen(false)
                              }
                            }}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                          </Link>
                        </motion.li>
                      )
                    })}
                  </ul>
                </nav>

                {/* Social Links & Theme Toggle */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <a
                          href="https://github.com/tetikmustafa"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub Profile"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <a
                          href="https://linkedin.com/in/mustafa-tetik"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn Profile"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      aria-label="Toggle theme"
                    >
                      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Compact sidebar when closed */}
      <motion.div
        initial={false}
        animate={{ 
          width: isOpen ? 0 : "4rem",
          opacity: isOpen ? 0 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          opacity: { duration: 0.2 }
        }}
        className="fixed left-0 top-0 z-50 h-full bg-card/80 backdrop-blur-sm border-r border-border shadow-lg md:bg-card overflow-hidden"
      >
        <div className="flex h-full flex-col">
          {/* Toggle Button */}
          <div className="p-4 border-b border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle sidebar"
              className="w-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation Icons */}
          <nav className="flex-1 p-2">
            <ul className="space-y-2">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href
                return (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 0.1 + index * 0.05,
                      duration: 0.2,
                      ease: "easeOut"
                    }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-center p-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
                        isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground",
                      )}
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          setIsOpen(false)
                        }
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                    </Link>
                  </motion.li>
                )
              })}
            </ul>
          </nav>

          {/* Social Links & Theme Toggle */}
          <div className="p-2 border-t border-border">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.2 }}
              >
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href="https://github.com/tetikmustafa"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.2 }}
              >
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href="https://linkedin.com/in/mustafa-tetik"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
