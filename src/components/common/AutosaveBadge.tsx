import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Loader2 } from 'lucide-react';

interface Props {
  status: 'idle' | 'saving' | 'saved';
}

export function AutosaveBadge({ status }: Props) {
  return (
    <AnimatePresence mode="wait">
      {status !== 'idle' && (
        <motion.div
          key={status}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5 text-xs text-[var(--muted)] px-3 py-1.5 rounded-full
            bg-[var(--surface)] border border-[var(--border)]"
        >
          {status === 'saving' ? (
            <>
              <Loader2 size={11} className="animate-spin" />
              <span>Saving…</span>
            </>
          ) : (
            <>
              <Cloud size={11} className="text-emerald-400" />
              <span className="text-emerald-400">Saved locally</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
