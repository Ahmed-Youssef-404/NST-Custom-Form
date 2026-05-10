import React, { useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import type { SurveyField } from '../../types/survey';
import { cn } from '../../lib/utils';

interface Props {
  field: SurveyField;
}

export function TextAreaField({ field }: Props) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const value = watch(field.id);
  const error = errors[field.id]?.message as string | undefined;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 300) + 'px';
  }, [value]);

  const { ref, ...rest } = register(field.id);

  return (
    <div className="field-wrapper">
      <label htmlFor={field.id} className="field-label">
        {field.label}
        {field.required && <span className="text-[var(--accent)] ml-1">*</span>}
      </label>
      {field.helperText && <p className="field-helper">{field.helperText}</p>}
      <textarea
        id={field.id}
        placeholder={field.placeholder}
        rows={3}
        className={cn(
          'field-input resize-none overflow-y-auto transition-[height] duration-150',
          error && 'border-red-500/60 focus:ring-red-500/30'
        )}
        style={{ maxHeight: '300px' }}
        ref={(el) => {
          ref(el);
          (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
        }}
        {...rest}
        aria-invalid={!!error}
      />
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
