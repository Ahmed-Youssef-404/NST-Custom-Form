import { useSurveyStore } from '../store/surveyStore';
import { surveySections, TOTAL_SECTIONS } from '../config/surveySections';

export function useProgress() {
  const currentSectionIndex = useSurveyStore((s) => s.currentSectionIndex);
  const completedSections = useSurveyStore((s) => s.completedSections);

  const currentSection = surveySections[currentSectionIndex];
  const progressPercent = Math.round(
    (completedSections.length / TOTAL_SECTIONS) * 100
  );
  const isLastSection = currentSectionIndex === TOTAL_SECTIONS - 1;
  const isComplete = completedSections.length === TOTAL_SECTIONS;

  return {
    currentSectionIndex,
    currentSection,
    completedSections,
    totalSections: TOTAL_SECTIONS,
    progressPercent,
    isLastSection,
    isComplete,
    sections: surveySections,
  };
}
