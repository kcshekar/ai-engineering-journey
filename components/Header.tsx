"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { motion } from "framer-motion"
import { LayoutDashboard, Layers, FileText, FolderGit2, LogOut } from "lucide-react"

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
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo">AI</div>
          <div className="header-title">
            ai-engineering<span>.journey</span>
          </div>
        </div>
        <nav className="header-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-btn ${isActive(item.href) ? "active" : ""}`}
            >
              <item.icon />
              <span className="nav-btn-label">{item.label}</span>
            </Link>
          ))}
          <button
            className="nav-btn"
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign out"
          >
            <LogOut />
            <span className="nav-btn-label">Sign out</span>
          </button>
        </nav>
      </div>
    </motion.header>
  )
}
