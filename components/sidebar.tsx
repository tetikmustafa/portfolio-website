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
        className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg bg-card border border-border shadow-sm"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Expanded sidebar (mobile: slides in, desktop: toggled) */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-card border-r border-border shadow-lg flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:hidden"
        }`}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-foreground">Mustafa Tetik</h1>
              <p className="text-sm text-muted-foreground mt-1">Computer Engineering Student</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-accent"
              aria-label="Close sidebar"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <a href="https://github.com/tetikmustafa" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 rounded-lg hover:bg-accent text-muted-foreground">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com/in/mustafa-tetik" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 rounded-lg hover:bg-accent text-muted-foreground">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent text-muted-foreground" aria-label="Toggle theme">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Compact sidebar (desktop only, when closed) */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-16 bg-card border-r border-border hidden md:flex flex-col transition-all duration-300 ease-out ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="p-4 border-b border-border">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center justify-center p-1 rounded-lg hover:bg-accent transition-colors"
            aria-label="Open sidebar"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>

        <nav className="flex-1 p-2">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-center p-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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

        <div className="p-2 border-t border-border flex flex-col items-center gap-1">
          <a href="https://github.com/tetikmustafa" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors">
            <Github className="h-5 w-5" />
          </a>
          <a href="https://linkedin.com/in/mustafa-tetik" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors">
            <Linkedin className="h-5 w-5" />
          </a>
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors" aria-label="Toggle theme">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </aside>
    </>
  )
}
