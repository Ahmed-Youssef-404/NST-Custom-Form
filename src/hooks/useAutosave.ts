import { useEffect, useRef, useState, useCallback } from 'react';
import { useSurveyStore } from '../store/surveyStore';

type AutosaveStatus = 'idle' | 'saving' | 'saved';

export function useAutosave(data: Record<string, unknown>, delay = 2000) {
  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setLastSaved = useSurveyStore((s) => s.setLastSaved);
  const setAnswers = useSurveyStore((s) => s.setAnswers);

  const save = useCallback(
    (payload: Record<string, unknown>) => {
      setAnswers(payload);
      setLastSaved(new Date().toISOString());
      setStatus('saved');
    },
    [setAnswers, setLastSaved]
  );

  useEffect(() => {
    const hasData = Object.keys(data).some(
      (k) => data[k] !== undefined && data[k] !== '' && data[k] !== null
    );
    if (!hasData) return;

    setStatus('saving');

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      save(data);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, delay, save]);

  return { status };
}
