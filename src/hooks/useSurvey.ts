// hooks/useSurvey.ts
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurveyStore } from '../store/surveyStore';
import { sectionSchemas, surveySections } from '../config/surveySections';
import type { SurveyAnswers } from '../types/survey';
import { isFormFullyCompleted } from '../utils/surveyValidation';
import { finalSend } from '../services/finalSend.service';

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

  // State for submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

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
      // الأول نخزن الإجابات
      setAnswers(sectionAnswers);

      // نتأكد من صحة القسم
      const sectionIndex = surveySections.findIndex(s => s.id === currentSection.id);
      const schema = sectionSchemas[sectionIndex];
      const isValid = schema.safeParse(sectionAnswers).success;

      if (!isValid) {
        console.warn('Cannot proceed: section has missing required fields');
        return;
      }

      // نحدد إن القسم مكتمل
      markSectionComplete(currentSection.id, { ...answers, ...sectionAnswers });

      if (isLastSection) {
        navigate('/summary');
      } else {
        goToSection(currentSectionIndex + 1);
      }
    },
    [setAnswers, currentSection, isLastSection, navigate, goToSection, currentSectionIndex, answers, markSectionComplete]
  );

  const goBack = useCallback(() => {
    if (currentSectionIndex > 0) {
      goToSection(currentSectionIndex - 1);
    } else {
      // navigate('/');
    }
  }, [currentSectionIndex, goToSection, navigate]);


  // useSurvey.ts - handleSubmit (من غير reset)
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    if (!isFormFullyCompleted(answers, surveySections.length)) {
      setSubmitError('Please complete all required fields before submitting');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setIsSubmitSuccess(false);

    try {
      const payload = answers;
      console.log('Submitting Survey:', payload);

      await finalSend(payload);

      setIsSubmitSuccess(true);
      submitSurvey(); // Mark as submitted in store
      navigate('/done');

    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, isSubmitting, submitSurvey, navigate]);


  const handleReset = useCallback(() => {
    resetSurvey();
    startSurvey();
    // navigate('/');
  }, [resetSurvey, startSurvey, navigate]);

  // Use the validation function we created earlier
  const isFullyCompleted = useMemo(() => {
    return isFormFullyCompleted(answers, surveySections.length);
  }, [answers]);

  return {
    // Existing
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
    isFullyCompleted,

    // New submission states
    isSubmitting,
    submitError,
    isSubmitSuccess,
  };
}