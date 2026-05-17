// pages/SummaryPage.tsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Edit, Send, Loader2, AlertCircle } from 'lucide-react';
import { useSurvey } from '../hooks/useSurvey';
import { surveySections } from '../config/surveySections';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function SummaryPage() {
  const navigate = useNavigate();
  const {
    answers,
    handleSubmit,
    isFullyCompleted,
    goToSection,
    isSubmitting,
    submitError,
    isSubmitSuccess
  } = useSurvey();

  // Redirect if not completed
  useEffect(() => {
    if (!isFullyCompleted) {
      navigate('/');
    }
  }, [isFullyCompleted, navigate]);

  // إذا لم يكتمل الاستبيان، لا تعرض المحتوى
  const hasShownToast = useRef(false);

  if (!isFullyCompleted) {
    if (!hasShownToast.current) {
      toast("Complete the Form", { position: "top-center" });
      hasShownToast.current = true;
    }
    return null;
  }

  // Reset when condition changes
  useEffect(() => {
    if (isFullyCompleted) {
      hasShownToast.current = false;
    }
  }, [isFullyCompleted]);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 sm:p-10"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
              Review Your Answers
            </h1>
            <p className="text-[var(--muted)]">
              Please review your responses before submitting
            </p>
          </div>

          {/* 🔥 عرض رسالة الخطأ لو موجودة */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-500">{submitError}</p>
            </motion.div>
          )}

          <div className="space-y-8">
            {surveySections.map((section, sectionIdx) => (
              <div key={section.id} className="border-t border-[var(--border)] pt-6 first:border-t-0 first:pt-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[var(--foreground)]">
                    {section.title}
                  </h2>
                  <button
                    onClick={() => goToSection(sectionIdx)}
                    disabled={isSubmitting}
                    className="flex items-center gap-1 text-sm text-[var(--primary)] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                </div>

                <div className="space-y-3">
                  {section.fields.map((field) => {
                    const value = answers[field.id];
                    if (!value && !field.required) return null;

                    let displayValue = value;
                    if (Array.isArray(value)) {
                      displayValue = value.map(v => {
                        const opt = field.options?.find(o => o.value === v);
                        return opt?.label || v;
                      }).join(', ');
                    } else if (field.options) {
                      const option = field.options.find(o => o.value === value);
                      displayValue = option?.label || value;
                    }

                    return (
                      <div key={field.id} className="flex justify-between items-start py-2">
                        <span className="text-sm text-[var(--muted)]">{field.label}</span>
                        <span className="text-sm font-medium text-[var(--foreground)] text-right max-w-[60%] break-words">
                          {displayValue || '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-[var(--border)]">
            <motion.button
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              onClick={handleSubmit}
              disabled={isSubmitting || !isFullyCompleted}
              className="w-full flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                boxShadow: '0 0 20px var(--primary)/25',
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit Form
                </>
              )}
            </motion.button>

            {/* رسالة نجاح قبل التحويل (اختياري) */}
            {isSubmitSuccess && (
              <p className="text-center text-green-500 text-sm mt-3">
                Submission successful! Redirecting...
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}