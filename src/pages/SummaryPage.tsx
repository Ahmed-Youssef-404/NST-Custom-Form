import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Edit2, Send, ChevronLeft } from 'lucide-react';
import { AnimatedPage } from '../components/common/AnimatedPage';
import { useSurvey } from '../hooks/useSurvey';
import { surveySections } from '../config/surveySections';
import { useSurveyStore } from '../store/surveyStore';

function formatValue(value: unknown): string {
  if (value === undefined || value === null || value === '') return '—';
  if (Array.isArray(value)) return value.join(', ') || '—';
  if (typeof value === 'number') return String(value);
  return String(value);
}

function getFieldLabel(sectionIdx: number, fieldId: string): string {
  const section = surveySections[sectionIdx];
  const field = section?.fields.find((f) => f.id === fieldId);
  return field?.label ?? fieldId;
}

function getReadableValue(sectionIdx: number, fieldId: string, value: unknown): string {
  const section = surveySections[sectionIdx];
  const field = section?.fields.find((f) => f.id === fieldId);

  if (!field) return formatValue(value);

  if ((field.type === 'radio' || field.type === 'dropdown') && field.options) {
    const opt = field.options.find((o) => o.value === value);
    if (opt) return opt.label;
  }

  if (field.type === 'checkbox' && field.options && Array.isArray(value)) {
    const labels = (value as string[]).map(
      (v) => field.options?.find((o) => o.value === v)?.label ?? v
    );
    return labels.join(', ') || '—';
  }

  return formatValue(value);
}

export function SummaryPage() {
  const navigate = useNavigate();
  const { answers, handleSubmit, goToSection } = useSurvey();
  const { completedSections } = useSurveyStore();

  return (
    <AnimatedPage>
      <div className="min-h-screen pt-24 pb-36 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] mb-6 transition-colors"
            >
              <ChevronLeft size={15} />
              Back to survey
            </button>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Review Your Answers</h1>
            <p className="text-[var(--muted)] text-sm">Everything looks correct? Hit submit below.</p>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-6">
            {surveySections.map((section, sectionIdx) => {
              const isCompleted = completedSections.includes(section.id);
              const sectionAnswers = section.fields
                .map((f) => ({ ...f, rawValue: answers[f.id] }))
                .filter((f) => f.rawValue !== undefined && f.rawValue !== '');

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIdx * 0.1 }}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  {/* Section header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--foreground)]">
                        {section.title}
                      </h3>
                      <p className="text-xs text-[var(--muted)] mt-0.5">{sectionAnswers.length} answers</p>
                    </div>
                    <button
                      onClick={() => {
                        goToSection(sectionIdx);
                        navigate(section.route);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                        text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]
                        border border-[var(--border)] transition-all"
                    >
                      <Edit2 size={11} />
                      Edit
                    </button>
                  </div>

                  {/* Fields */}
                  <div className="divide-y divide-[var(--border)]">
                    {sectionAnswers.length === 0 ? (
                      <div className="px-6 py-4 text-sm text-[var(--muted)]">
                        No answers for this section.
                      </div>
                    ) : (
                      sectionAnswers.map((field) => (
                        <div key={field.id} className="px-6 py-3.5 flex items-start justify-between gap-6">
                          <span className="text-xs font-medium text-[var(--muted)] shrink-0 pt-0.5 w-32">
                            {getFieldLabel(sectionIdx, field.id)}
                          </span>
                          <span className="text-sm text-[var(--foreground)] text-right">
                            {getReadableValue(sectionIdx, field.id, field.rawValue)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky submit button */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-4 py-4"
        style={{ background: 'linear-gradient(to top, var(--background), transparent)' }}
      >
        <div className="max-w-2xl mx-auto">
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px var(--primary)/40' }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-semibold text-white transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              boxShadow: '0 0 30px var(--primary)/25',
            }}
          >
            <Send size={18} />
            Submit Survey
          </motion.button>
        </div>
      </div>
    </AnimatedPage>
  );
}
