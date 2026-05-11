// hooks/useProgress.ts
import { useMemo } from 'react';
import { useSurveyStore } from '../store/surveyStore';
import { surveySections } from '../config/surveySections';
import { isSectionComplete } from '../utils/surveyValidation';

export function useProgress() {
  const { currentSectionIndex, answers } = useSurveyStore();

  const totalSections = surveySections.length;

  const completedSections = useMemo(() => {
    const completed: string[] = [];
    for (let i = 0; i < totalSections; i++) {
      if (isSectionComplete(i, answers)) {
        completed.push(surveySections[i].id);
      }
    }
    return completed;
  }, [answers, totalSections]);

  const progressPercent = useMemo(() => {
    const percent = (completedSections.length / totalSections) * 100;
    return Math.round(percent); // 👈 هنا التقريب لأقرب عدد صحيح
  }, [completedSections.length, totalSections]);

  return {
    currentSectionIndex,
    totalSections,
    completedSections,
    progressPercent,
  };
}