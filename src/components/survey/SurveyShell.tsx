// SurveyShell.tsx
import { useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedCallback } from 'use-debounce';
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
  const { answers, setAnswers } = useSurveyStore();

  const schema = useMemo(() => generateSectionSchema(section), [section]);

  const methods = useForm<any>({
    resolver: zodResolver(schema),
    // بنخلي القيم الابتدائية هي اللي في الـ store أول ما السيكشن يفتح
    defaultValues: useMemo(() => {
      const vals: Record<string, any> = {};
      section.fields.forEach(f => {
        vals[f.id] = answers[f.id] ?? '';
      });
      return vals;
    }, [section.id]), // فقط لما السيكشن يتغير
    mode: 'onChange',
  });

  const { handleSubmit, reset, watch, formState: { isValid } } = methods;

  const debouncedSave = useDebouncedCallback((data: any) => {
    setAnswers(data);
  }, 400);


  // ✅ التعديل الأول: حفظ البيانات فقط بدون مراقبة الـ answers هنا
  useEffect(() => {
    const subscription = watch((value) => {
      // بنفلتر القيم عشان ميبقاش فيه undefined
      const cleanValues = Object.fromEntries(
        Object.entries(value).filter(([_, v]) => v !== undefined)
      );
      debouncedSave(cleanValues);
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSave]);

  // ✅ التعديل الثاني: الـ reset يحصل فقط لما الـ section id يتغير
  useEffect(() => {
    const sectionValues: Record<string, any> = {};
    section.fields.forEach(field => {
      sectionValues[field.id] = answers[field.id] ?? '';
    });
    
    // بنعمل reset عشان لو المستخدم اتنقل بين الأقسام
    reset(sectionValues, { keepDefaultValues: false });
  }, [section.id, reset]); // شيلنا answers من هنا تماماً

  const onSubmit = (data: any) => {
    onComplete(data as Record<string, unknown>);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <StepIndicator
          sections={surveySections}
          currentIndex={currentSectionIndex}
          completedIds={completedSections}
        />

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--muted)] font-medium">
              Step {currentSectionIndex + 1} of {totalSections}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--muted)] font-medium">{Math.round(progressPercent)}%</span>
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
                    disabled={!isValid}
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