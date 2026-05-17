import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Play } from 'lucide-react';
import { HeroSection } from '../components/hero/HeroSection';
import { useSurveyStore } from '../store/surveyStore';
import { surveySections } from '../config/surveySections';
import { AnimatedPage } from '../components/common/AnimatedPage';

export function HomePage() {
  const navigate = useNavigate();
  const { hasUnfinishedSurvey, currentSectionIndex, resetSurvey, startSurvey } = useSurveyStore();
  const unfinished = hasUnfinishedSurvey();

  const handleContinue = () => {
    navigate(surveySections[currentSectionIndex].route);
  };

  const handleStartOver = () => {
    resetSurvey();
    startSurvey();
    navigate('/survey/personal');
  };

  return (
    <AnimatedPage>
      <HeroSection />

      {/* Unfinished survey banner */}
      <AnimatePresence>
        {unfinished && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-4 sm:bottom-16 inset-x-0 z-40 px-2 sm:px-4 sm:w-fit"
          >
            <div
              className="glass-card rounded-2xl p-4 shadow-2xl border border-[var(--primary)]/20 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  Unfinished Form
                </p>

                <p className="text-xs text-[var(--muted)] mt-0.5 truncate">
                  You were on "{surveySections[currentSectionIndex]?.title}"
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={handleStartOver}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
        text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]
        border border-[var(--border)] transition-all"
                >
                  <RotateCcw size={12} />
                  Start over
                </button>

                <button
                  onClick={handleContinue}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary), var(--secondary))",
                    boxShadow: "0 0 16px rgb(0 0 0 / 0.15)",
                  }}
                >
                  <Play size={12} />
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
