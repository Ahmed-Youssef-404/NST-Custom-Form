import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import type { SurveyField } from '../../types/survey';
import { cn } from '../../lib/utils';

interface Props {
  field: SurveyField;
}

const RATINGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function RatingField({ field }: Props) {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const [hovered, setHovered] = useState<number | null>(null);
  const selected = watch(field.id) as number | undefined;
  const error = errors[field.id]?.message as string | undefined;

  const active = hovered ?? selected ?? 0;

  const getRatingLabel = (val: number) => {
    if (val <= 3) return 'Low';
    if (val <= 6) return 'Moderate';
    if (val <= 8) return 'Good';
    return 'Excellent';
  };

  const getRatingColor = (val: number) => {
    if (val <= 3) return 'var(--rating-low)';
    if (val <= 6) return 'var(--rating-mid)';
    if (val <= 8) return 'var(--primary)';
    return 'var(--rating-high)';
  };

  return (
    <div className="field-wrapper">
      <label className="field-label">
        {field.label}
        {field.required && <span className="text-[var(--accent)] ml-1">*</span>}
      </label>
      {field.helperText && <p className="field-helper">{field.helperText}</p>}

      <div className="mt-3">
        {/* 2 rows: 1-5 and 6-10 */}
        <div className="flex flex-col gap-2">
          {[RATINGS.slice(0, 5), RATINGS.slice(5)].map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-2">
              {row.map((num) => {
                const isActive = num <= active;
                const isSelected = num === selected;
                return (
                  <motion.button
                    key={num}
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setValue(field.id, num, { shouldValidate: true, shouldDirty: true })
                    }
                    onMouseEnter={() => setHovered(num)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      'flex-1 h-11 rounded-lg border text-sm font-semibold transition-all duration-150 relative overflow-hidden',
                      isActive
                        ? 'text-white border-transparent'
                        : 'text-[var(--muted)] border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/40'
                    )}
                    style={
                      isActive
                        ? {
                            background: `linear-gradient(135deg, ${getRatingColor(active)}, ${getRatingColor(active)}cc)`,
                            boxShadow: isSelected ? `0 0 16px ${getRatingColor(active)}55` : 'none',
                          }
                        : {}
                    }
                    aria-label={`Rating ${num}`}
                    aria-pressed={isSelected}
                  >
                    {num}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Label */}
        <div className="flex justify-between mt-2 text-xs text-[var(--muted)]">
          <span>Not satisfied</span>
          {active > 0 && (
            <motion.span
              key={active}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-medium"
              style={{ color: getRatingColor(active) }}
            >
              {active}/10 · {getRatingLabel(active)}
            </motion.span>
          )}
          <span>Extremely satisfied</span>
        </div>
      </div>
      {error && <p className="field-error mt-1" role="alert">{error}</p>}
    </div>
  );
}
