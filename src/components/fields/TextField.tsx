import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { SurveyField } from '../../types/survey';
import { cn } from '../../lib/utils';

interface Props {
  field: SurveyField;
}

export function TextField({ field }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[field.id]?.message as string | undefined;

  return (
    <div className="field-wrapper">
      <label htmlFor={field.id} className="field-label">
        {field.label}
        {field.required && <span className="text-[var(--accent)] ml-1">*</span>}
      </label>
      {field.helperText && (
        <p className="field-helper">{field.helperText}</p>
      )}
      <input
        id={field.id}
        type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
        placeholder={field.placeholder}
        className={cn('field-input', error && 'border-red-500/60 focus:ring-red-500/30')}
        {...register(field.id)}
        aria-invalid={!!error}
        aria-describedby={error ? `${field.id}-error` : undefined}
      />
      {error && (
        <p id={`${field.id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
