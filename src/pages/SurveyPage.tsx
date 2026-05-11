import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SurveyShell } from '../components/survey/SurveyShell';
import { surveySections } from '../config/surveySections';
import { useSurvey } from '../hooks/useSurvey';
import { useBeforeUnload } from '../hooks/useBeforeUnload';
import { useSurveyStore } from '../store/surveyStore';

export function SurveyPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const { completeSection, goBack } = useSurvey();
  const setCurrentSection = useSurveyStore((s) => s.setCurrentSection);
  const { startedAt } = useSurveyStore();

  // Sync section index from URL
  useEffect(() => {
    const idx = surveySections.findIndex((s) => s.id === sectionId);
    if (idx === -1) {
      navigate(`${surveySections[0].route}`);
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

  return (
    <SurveyShell
      section={section}
      onComplete={completeSection}
      onBack={goBack}
    />
  );
}
