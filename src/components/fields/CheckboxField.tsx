import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { SurveyField } from '../../types/survey';
import { cn } from '../../lib/utils';

interface Props {
  field: SurveyField;
}

export function CheckboxField({ field }: Props) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const values: string[] = watch(field.id) ?? [];
  const error = errors[field.id]?.message as string | undefined;

  const toggle = (value: string) => {
    const next = values.includes(value)
      ? values.filter((v) => v !== value)
      : [...values, value];
    setValue(field.id, next, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="field-wrapper">
      <fieldset>
        <legend className="field-label">
          {field.label}
          {field.required && <span className="text-[var(--accent)] ml-1">*</span>}
        </legend>
        {field.helperText && <p className="field-helper">{field.helperText}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          {field.options?.map((option, i) => {
            const isChecked = values.includes(option.value);
            return (
              <motion.button
                key={option.value}
                type="button"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => toggle(option.value)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all duration-200',
                  'hover:border-[var(--primary)]/50 hover:bg-[var(--surface-2)]',
                  isChecked
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-[0_0_16px_var(--primary)]/10'
                    : 'border-[var(--border)] bg-[var(--surface)]'
                )}
                aria-pressed={isChecked}
              >
                <div
                  className={cn(
                    'w-4.5 h-4.5 w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200',
                    isChecked
                      ? 'border-[var(--primary)] bg-[var(--primary)]'
                      : 'border-[var(--muted)]'
                  )}
                >
                  {isChecked && <Check size={10} className="text-white stroke-[3]" />}
                </div>
                <span
                  className={cn(
                    'text-sm font-medium transition-colors duration-200',
                    isChecked ? 'text-[var(--foreground)]' : 'text-[var(--muted)]'
                  )}
                >
                  {option.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </fieldset>
      {error && (
        <p className="field-error mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
