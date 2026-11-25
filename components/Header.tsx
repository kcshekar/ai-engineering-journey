"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { DURATION, EASE_OUT } from "@/lib/motion"
import { motion } from "framer-motion"
import { LayoutDashboard, Layers, FileText, FolderGit2, LogOut } from "lucide-react"
import ThemeToggle from "./ThemeToggle"

const navItems = [
  { href: "/",         label: "Dashboard", icon: LayoutDashboard },
  { href: "/layers",   label: "Layers",    icon: Layers },
  { href: "/notes",    label: "Notes",     icon: FileText },
  { href: "/projects", label: "Projects",  icon: FolderGit2 },
]

export default function Header() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <motion.header
      className="header"
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: DURATION.slow, ease: EASE_OUT }}
    >
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo">AI</div>
          <div className="header-title">
            ai-engineering<span>.journey</span>
          </div>
        </div>
        <nav className="header-nav" aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-btn ${isActive(item.href) ? "active" : ""}`}
              aria-label={item.label}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              <item.icon />
              <span className="nav-btn-label">{item.label}</span>
            </Link>
          ))}
          <button
            className="nav-btn"
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut />
            <span className="nav-btn-label">Sign out</span>
          </button>
          <ThemeToggle />
        </nav>
      </div>
    </motion.header>
  )
}
