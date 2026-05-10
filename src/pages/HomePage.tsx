import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Play } from 'lucide-react';
import { HeroSection } from '../components/hero/HeroSection';
import { useSurveyStore } from '../store/surveyStore';
import { surveySections } from '../config/surveySections';
import { AnimatedPage } from '../components/common/AnimatedPage';

export function HomePage() {
  const navigate = useNavigate();
  const { hasUnfinishedSurvey, currentSectionIndex, resetSurvey, startSurvey, answers } = useSurveyStore();
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
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4"
          >
            <div className="glass-card rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xl border border-[var(--primary)]/20">
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">Unfinished survey</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  You were on "{surveySections[currentSectionIndex]?.title}"
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleStartOver}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
                    text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]
                    border border-[var(--border)] transition-all"
                >
                  <RotateCcw size={12} />
                  Start over
                </button>
                <button
                  onClick={handleContinue}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    boxShadow: '0 0 16px var(--primary)/30',
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
