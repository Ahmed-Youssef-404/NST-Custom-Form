import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import type { SurveyField } from '../../types/survey';
import { cn } from '../../lib/utils';

interface Props {
  field: SurveyField;
}

export function RadioField({ field }: Props) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const selected = watch(field.id);
  const error = errors[field.id]?.message as string | undefined;

  return (
    <div className="field-wrapper">
      <fieldset>
        <legend className="field-label">
          {field.label}
          {field.required && <span className="text-[var(--accent)] ml-1">*</span>}
        </legend>
        {field.helperText && <p className="field-helper">{field.helperText}</p>}
        <div className="flex flex-col gap-2 mt-3">
          {field.options?.map((option, i) => {
            const isSelected = selected === option.value;
            return (
              <motion.label
                key={option.value}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  'flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200',
                  'hover:border-[var(--primary)]/50 hover:bg-[var(--surface-2)]',
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-[0_0_20px_var(--primary)]/10'
                    : 'border-[var(--border)] bg-[var(--surface)]'
                )}
              >
                <input
                  type="radio"
                  value={option.value}
                  className="sr-only"
                  {...register(field.id)}
                />
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200',
                    isSelected
                      ? 'border-[var(--primary)] bg-[var(--primary)]'
                      : 'border-[var(--muted)]'
                  )}
                >
                  {isSelected && (
                    <motion.div
                      layoutId={`radio-dot-${field.id}`}
                      className="w-1.5 h-1.5 rounded-full bg-white"
                    />
                  )}
                </div>
                <span
                  className={cn(
                    'text-sm font-medium transition-colors duration-200',
                    isSelected ? 'text-[var(--foreground)]' : 'text-[var(--muted)]'
                  )}
                >
                  {option.label}
                </span>
              </motion.label>
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
