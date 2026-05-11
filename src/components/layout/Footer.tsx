import { AstroidIcon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--border)] ">
      {/* Subtle top glow line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-48 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
          opacity: 0.5,
        }}
      />

      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Logo mark */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
            <AstroidIcon size={14} className="text-white fill-white" />
          </div>
          <span className="text-xs font-semibold text-[var(--foreground)]">
            <span className="text-[var(--primary)]">NST</span>
          </span>
        </div>

        {/* Copy */}
        <p className="text-xs text-[var(--muted)] text-center">
          Designed & developed by{' '}
          <span className="text-[var(--foreground)] font-medium">NST</span>
          {' '}· All rights reserved © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}