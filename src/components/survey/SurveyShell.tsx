// SurveyShell.tsx (النسخة النهائية)
import { useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import type { SurveySection } from '../../types/survey';
import { FieldRenderer } from '../fields/FieldRenderer';
import { StepIndicator } from './StepIndicator';
import { AnimatedPage } from '../common/AnimatedPage';
import { useProgress } from '../../hooks/useProgress';
import { useSurveyStore } from '../../store/surveyStore';
import { surveySections } from '../../config/surveySections';
import { generateSectionSchema } from '../../utils/surveySchemaGenerator';

interface Props {
  section: SurveySection;
  onComplete: (data: Record<string, unknown>) => void;
  onBack: () => void;
}

export function SurveyShell({ section, onComplete, onBack }: Props) {
  const { currentSectionIndex, completedSections, totalSections, progressPercent } = useProgress();
  const { answers } = useSurveyStore();

  // 🎯 توليد الـ schema تلقائياً من الـ section
  const schema = useMemo(() => generateSectionSchema(section), [section]);

  const methods = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: answers,
    mode: 'onChange',
  });

  const { handleSubmit, reset, formState: { isValid, isDirty } } = methods;

  // Reset form when section changes
  useEffect(() => {
    reset(answers);
  }, [section.id, answers, reset]);

  const onSubmit = (data: any) => {
    onComplete(data as Record<string, unknown>);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Step indicator - يتغير تلقائياً مع surveySections */}
        <StepIndicator
          sections={surveySections}
          currentIndex={currentSectionIndex}
          completedIds={completedSections}
        />

        {/* Progress bar - نسبة مئوية دقيقة */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--muted)] font-medium">
              Step {currentSectionIndex + 1} of {totalSections}
            </span>
            <div className="flex items-center gap-3">
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

        {/* Form Card */}
        <AnimatedPage key={section.id}>
          <div className="glass-card rounded-3xl p-8 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-2">
                {section.title}
              </h2>
              <p className="text-[var(--muted)] text-sm leading-relaxed">{section.subtitle}</p>
            </div>

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
                    disabled={!isValid && isDirty}
                    className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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