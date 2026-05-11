import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurveyStore } from '../store/surveyStore';
import { sectionSchemas, surveySections } from '../config/surveySections';
import type { SurveyAnswers } from '../types/survey';
// import { sectionSchemas } from '@/schemas/sectionSchemas';
import { isFormFullyCompleted } from '@/utils/surveyValidation';

export function useSurvey() {
  const navigate = useNavigate();
  const {
    currentSectionIndex,
    setCurrentSection,
    markSectionComplete,
    setAnswers,
    answers,
    completedSections,
    submitSurvey,
    resetSurvey,
    startSurvey,
  } = useSurveyStore();

  const currentSection = surveySections[currentSectionIndex];
  const isLastSection = currentSectionIndex === surveySections.length - 1;

  const goToSection = useCallback(
    (index: number) => {
      if (index < 0 || index >= surveySections.length) return;
      setCurrentSection(index);
      navigate(surveySections[index].route);
    },
    [navigate, setCurrentSection]
  );

  const completeSection = useCallback(
    (sectionAnswers: SurveyAnswers) => {
      setAnswers(sectionAnswers);
      const sectionIndex = surveySections.findIndex(s => s.id === currentSection.id);
      const schema = sectionSchemas[sectionIndex];
      const isValid = schema.safeParse(sectionAnswers).success;

      if (!isValid) {
        console.warn('Cannot proceed: missing required fields');
        return;
      }

      markSectionComplete(currentSection.id, sectionAnswers);
      if (isLastSection) navigate('/summary');
      else goToSection(currentSectionIndex + 1);
    },
    [setAnswers, markSectionComplete, currentSection, isLastSection, navigate, currentSectionIndex, goToSection]
  );

  const goBack = useCallback(() => {
    if (currentSectionIndex > 0) {
      goToSection(currentSectionIndex - 1);
    } else {
      navigate('/');
    }
  }, [currentSectionIndex, goToSection, navigate]);

  const handleSubmit = useCallback(async () => {
    // In production this would POST to an API
    const payload = answers;
    console.log('Survey Submitted:', payload);
    submitSurvey();
    navigate('/done');
  }, [answers, submitSurvey, navigate]);

  const handleReset = useCallback(() => {
    resetSurvey();
    startSurvey();
    navigate('/');
  }, [resetSurvey, startSurvey, navigate]);

  // Use the validation function we created earlier
  const isFullyCompleted = useMemo(() => {
    return isFormFullyCompleted(answers, surveySections.length);
  }, [answers]);

  return {
    currentSection,
    currentSectionIndex,
    isLastSection,
    answers,
    completedSections,
    goToSection,
    completeSection,
    goBack,
    handleSubmit,
    handleReset,
    isFullyCompleted
  };
}