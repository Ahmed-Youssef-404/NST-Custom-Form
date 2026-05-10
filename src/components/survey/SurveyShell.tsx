import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import type { ZodSchema } from 'zod';
import type { SurveySection } from '../../types/survey';
import { FieldRenderer } from '../fields/FieldRenderer';
import { StepIndicator } from './StepIndicator';
import { AutosaveBadge } from '../common/AutosaveBadge';
import { AnimatedPage } from '../common/AnimatedPage';
import { useAutosave } from '../../hooks/useAutosave';
import { useProgress } from '../../hooks/useProgress';
import { useSurveyStore } from '../../store/surveyStore';
import { surveySections } from '../../config/surveySections';

interface Props {
  section: SurveySection;
  schema: ZodSchema;
  onComplete: (data: Record<string, unknown>) => void;
  onBack: () => void;
}

export function SurveyShell({ section, schema, onComplete, onBack }: Props) {
  const { currentSectionIndex, completedSections, totalSections, progressPercent } = useProgress();
  const { answers } = useSurveyStore();
  const goToSection = useSurveyStore((s) => s.setCurrentSection);

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: answers as Record<string, unknown>,
    mode: 'onChange',
  });

  const { handleSubmit, watch, reset } = methods;

  // Reset form with persisted answers on mount
  useEffect(() => {
    reset(answers as Record<string, unknown>);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.id]);

  const watchedValues = watch();
  const { status } = useAutosave(watchedValues);

  const onSubmit = (data: Record<string, unknown>) => {
    onComplete(data);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Step indicator */}
        <StepIndicator
          sections={surveySections}
          currentIndex={currentSectionIndex}
          completedIds={completedSections}
        />

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--muted)] font-medium">
              Step {currentSectionIndex + 1} of {totalSections}
            </span>
            <div className="flex items-center gap-3">
              <AutosaveBadge status={status} />
              <span className="text-xs text-[var(--muted)] font-medium">{progressPercent}%</span>
            </div>
          </div>
          <div className="h-1 bg-[var(--border)] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Card */}
        <AnimatedPage key={section.id}>
          <div className="glass-card rounded-3xl p-8 sm:p-10">
            {/* Section header */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-2">
                {section.title}
              </h2>
              <p className="text-[var(--muted)] text-sm leading-relaxed">{section.subtitle}</p>
            </div>

            {/* Fields */}
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="flex flex-col gap-6">
                  {section.fields.map((field, i) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <FieldRenderer field={field} />
                    </motion.div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--border)]">
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                      text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]
                      border border-transparent hover:border-[var(--border)] transition-all duration-200"
                  >
                    <ArrowLeft size={15} />
                    Back
                  </button>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      boxShadow: '0 0 20px var(--primary)/25',
                    }}
                  >
                    {currentSectionIndex === totalSections - 1 ? (
                      <>Review Answers <ChevronRight size={15} /></>
                    ) : (
                      <>Continue <ArrowRight size={15} /></>
                    )}
                  </motion.button>
                </div>
              </form>
            </FormProvider>
          </div>
        </AnimatedPage>
      </div>
    </div>
  );
}
