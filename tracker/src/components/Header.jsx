import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Layers, FileText, FolderGit2 } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'layers', label: 'Layers', icon: Layers },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
];

export default function Header({ activePage, onNavigate }) {
  return (
    <motion.header
      className="header"
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
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
            <button
              key={item.id}
              className={`nav-btn ${activePage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
            >
              <item.icon />
              <span className="nav-btn-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
