import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Survey', to: '/survey/personal' },
  { label: 'Summary', to: '/summary' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
          scrolled
            ? 'bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)] shadow-xl shadow-black/20'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center shadow-[0_0_14px_var(--primary)]/40 group-hover:shadow-[0_0_20px_var(--primary)]/60 transition-shadow">
              <Zap size={14} className="text-white fill-white" />
            </div>
            <span className="font-bold text-sm tracking-wide text-[var(--foreground)]">
              Pulse<span className="text-[var(--primary)]">Survey</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to ||
                (link.to === '/survey/personal' && location.pathname.startsWith('/survey'));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                      : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="sm:hidden p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm sm:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 bottom-0 w-72 bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <span className="font-semibold text-[var(--foreground)]">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--muted)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      isActive
                        ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                        : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        </div>
      )}
    </>
  );
}
