import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { SurveySection } from '../../types/survey';

interface Props {
  sections: SurveySection[];
  currentIndex: number;
  completedIds: string[];
  onStepClick?: (index: number) => void;
}

export function StepIndicator({ sections, currentIndex, completedIds, onStepClick }: Props) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {sections.map((section, idx) => {
        const isCompleted = completedIds.includes(section.id);
        const isCurrent = idx === currentIndex;
        const isClickable = isCompleted && onStepClick;

        return (
          <React.Fragment key={section.id}>
            {/* Step circle */}
            <button
              type="button"
              onClick={() => isClickable && onStepClick(idx)}
              disabled={!isClickable}
              className={cn(
                'flex flex-col items-center gap-1.5 group',
                isClickable && 'cursor-pointer'
              )}
              aria-label={`Step ${idx + 1}: ${section.title}`}
            >
              <motion.div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-all duration-300',
                  isCompleted
                    ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-[0_0_16px_var(--primary)]/40'
                    : isCurrent
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] shadow-[0_0_20px_var(--primary)]/20'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]'
                )}
                animate={isCurrent ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={{ duration: 0.6, repeat: isCurrent ? Infinity : 0, repeatDelay: 2 }}
              >
                {isCompleted ? <Check size={15} strokeWidth={3} /> : idx + 1}
              </motion.div>
              <span
                className={cn(
                  'text-[10px] font-medium hidden sm:block transition-colors duration-200',
                  isCurrent ? 'text-[var(--primary)]' : 'text-[var(--muted)]'
                )}
              >
                {section.title}
              </span>
            </button>

            {/* Connector line */}
            {idx < sections.length - 1 && (
              <div className="flex-1 h-px mx-2 relative overflow-hidden max-w-16">
                <div className="absolute inset-0 bg-[var(--border)]" />
                <motion.div
                  className="absolute inset-0 bg-[var(--primary)]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  style={{ originX: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
