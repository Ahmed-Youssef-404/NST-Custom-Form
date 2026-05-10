import React, { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import type { SurveyField } from '../../types/survey';
import { cn } from '../../lib/utils';

interface Props {
  field: SurveyField;
}

export function TagInputField({ field }: Props) {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const tags: string[] = watch(field.id) ?? [];
  const error = errors[field.id]?.message as string | undefined;
  const maxTags = field.maxTags ?? 10;

  const addTag = () => {
    const trimmed = inputVal.trim();
    if (!trimmed || tags.includes(trimmed) || tags.length >= maxTags) {
      setInputVal('');
      return;
    }
    setValue(field.id, [...tags, trimmed], { shouldValidate: true, shouldDirty: true });
    setInputVal('');
  };

  const removeTag = (tag: string) => {
    setValue(
      field.id,
      tags.filter((t) => t !== tag),
      { shouldValidate: true, shouldDirty: true }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && inputVal === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="field-wrapper">
      <label className="field-label">
        {field.label}
        {field.required && <span className="text-[var(--accent)] ml-1">*</span>}
      </label>
      {field.helperText && <p className="field-helper">{field.helperText}</p>}

      <div className="flex gap-2 mt-2">
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length >= maxTags ? `Max ${maxTags} skills` : field.placeholder}
          disabled={tags.length >= maxTags}
          className={cn(
            'field-input flex-1',
            error && 'border-red-500/60',
            tags.length >= maxTags && 'opacity-50 cursor-not-allowed'
          )}
          aria-label={`Add ${field.label}`}
        />
        <button
          type="button"
          onClick={addTag}
          disabled={!inputVal.trim() || tags.length >= maxTags}
          className={cn(
            'px-3 h-10 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]',
            'hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-200',
            'disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm font-medium'
          )}
          aria-label="Add tag"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          <AnimatePresence>
            {tags.map((tag) => (
              <motion.span
                key={tag}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                  bg-[var(--primary)]/15 border border-[var(--primary)]/30 text-[var(--primary)]"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-white transition-colors rounded-full"
                  aria-label={`Remove ${tag}`}
                >
                  <X size={12} />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="flex justify-between mt-1.5">
        {error && <p className="field-error" role="alert">{error}</p>}
        <span className="text-xs text-[var(--muted)] ml-auto">
          {tags.length}/{maxTags}
        </span>
      </div>
    </div>
  );
}
