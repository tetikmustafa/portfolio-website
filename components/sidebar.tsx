"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, FolderOpen, Mail, Moon, Sun, Github, Linkedin, ChevronLeft, ChevronRight, Menu } from "lucide-react"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: User },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Contact", href: "/contact", icon: Mail },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("theme")
    if (stored === "light") {
      setIsDark(false)
      document.documentElement.classList.remove("dark")
    } else {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.setAttribute("data-sidebar", "open")
    } else {
      document.body.removeAttribute("data-sidebar")
    }
    
    return () => document.body.removeAttribute("data-sidebar")
  }, [isOpen])

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    if (newDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg sidebar-glass border border-border/50"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Expanded sidebar ── */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 sidebar-glass border-r border-border/50 flex flex-col transition-transform duration-300 ease-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full md:hidden"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-border/50">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">Mustafa Tetik</h1>
              <p className="text-xs text-primary/60 mt-0.5">Computer Engineering</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors"
              aria-label="Close sidebar"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (window.innerWidth < 768) setIsOpen(false)
                    }}
                    className={`sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "sidebar-nav-active text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom social/theme */}
        <div className="p-3 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex gap-0.5">
              <a href="https://github.com/tetikmustafa" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                className="sidebar-icon-btn p-2 rounded-lg text-muted-foreground transition-all duration-200">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com/in/mustafa-tetik" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="sidebar-icon-btn p-2 rounded-lg text-muted-foreground transition-all duration-200">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
            <button onClick={toggleTheme}
              className="sidebar-icon-btn p-2 rounded-lg text-muted-foreground transition-all duration-200"
              aria-label="Toggle theme">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* ── Compact sidebar (desktop only) ── */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-16 sidebar-glass border-r border-border/50 hidden md:flex flex-col transition-all duration-300 ease-out ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {/* Toggle */}
        <div className="p-3 border-b border-border/50">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-accent/50 transition-colors"
            aria-label="Open sidebar"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Nav icons */}
        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`sidebar-compact-item flex items-center justify-center p-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "sidebar-nav-active text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title={item.name}
                  >
                    <item.icon className="h-5 w-5" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom icons */}
        <div className="p-2 border-t border-border/50 flex flex-col items-center gap-0.5">
          <a href="https://github.com/tetikmustafa" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
            className="sidebar-icon-btn p-2.5 rounded-lg text-muted-foreground transition-all duration-200">
            <Github className="h-5 w-5" />
          </a>
          <a href="https://linkedin.com/in/mustafa-tetik" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
            className="sidebar-icon-btn p-2.5 rounded-lg text-muted-foreground transition-all duration-200">
            <Linkedin className="h-5 w-5" />
          </a>
          <button onClick={toggleTheme}
            className="sidebar-icon-btn p-2.5 rounded-lg text-muted-foreground transition-all duration-200"
            aria-label="Toggle theme">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </aside>
    </>
  )
}
