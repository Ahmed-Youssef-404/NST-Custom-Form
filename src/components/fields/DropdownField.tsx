import { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import type { Field } from '../../types/survey';
import { cn } from '../../lib/utils';

interface Props {
  field: Field;
}

export function DropdownField({ field }: Props) {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = watch(field.id) as string | undefined;
  const error = errors[field.id]?.message as string | undefined;

  const selectedLabel = field.options?.find((o) => o.value === selected)?.label;

  const select = (value: string) => {
    setValue(field.id, value, { shouldValidate: true, shouldDirty: true });
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="field-wrapper" ref={ref}>
      <label className="field-label">
        {field.label}
        {field.required && <span className="text-[var(--accent)] ml-1">*</span>}
      </label>
      {field.helperText && <p className="field-helper">{field.helperText}</p>}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'field-input flex items-center justify-between text-left w-full',
          !selected && 'text-[var(--muted)]',
          error && 'border-red-500/60',
          open && 'border-[var(--primary)]/60 ring-2 ring-[var(--primary)]/20'
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{selectedLabel ?? field.placeholder ?? 'Select an option'}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-[var(--muted)]" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden"
          >
            {field.options?.map((option) => {
              const isSelected = selected === option.value;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => select(option.value)}
                  className={cn(
                    'flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150',
                    'hover:bg-[var(--surface-2)]',
                    isSelected && 'text-[var(--primary)]'
                  )}
                >
                  {option.label}
                  {isSelected && <Check size={14} />}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  );
}
