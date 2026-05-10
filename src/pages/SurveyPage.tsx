import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SurveyShell } from '../components/survey/SurveyShell';
import { surveySections } from '../config/surveySections';
import { sectionSchemas } from '../schemas/sectionSchemas';
import { useSurvey } from '../hooks/useSurvey';
import { useBeforeUnload } from '../hooks/useBeforeUnload';
import { useSurveyStore } from '../store/surveyStore';
import { AnimatedPage } from '../components/common/AnimatedPage';

export function SurveyPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const { completeSection, goBack, currentSectionIndex } = useSurvey();
  const setCurrentSection = useSurveyStore((s) => s.setCurrentSection);
  const { startedAt } = useSurveyStore();

  // Sync section index from URL
  useEffect(() => {
    const idx = surveySections.findIndex((s) => s.id === sectionId);
    if (idx === -1) {
      navigate('/survey/personal');
      return;
    }
    setCurrentSection(idx);
  }, [sectionId, navigate, setCurrentSection]);

  // Redirect if no session
  useEffect(() => {
    if (!startedAt) {
      navigate('/');
    }
  }, [startedAt, navigate]);

  useBeforeUnload(true, 'Your progress is saved locally, but are you sure you want to leave?');

  const sectionIdx = surveySections.findIndex((s) => s.id === sectionId);
  if (sectionIdx === -1) return null;

  const section = surveySections[sectionIdx];
  const schema = sectionSchemas[sectionIdx];

  return (
    <SurveyShell
      section={section}
      schema={schema}
      onComplete={completeSection}
      onBack={goBack}
    />
  );
}
