import { useEffect, useRef, useState, useCallback } from 'react';
import { useSurveyStore } from '../store/surveyStore';

type AutosaveStatus = 'idle' | 'saving' | 'saved';

export function useAutosave(data: Record<string, unknown>, delay = 2000) {
  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousDataRef = useRef<Record<string, unknown>>(data);
  const setLastSaved = useSurveyStore((s) => s.setLastSaved);
  const setAnswers = useSurveyStore((s) => s.setAnswers);

  const save = useCallback(
    (payload: Record<string, unknown>) => {
      setAnswers(payload);
      setLastSaved(new Date().toISOString());
      setStatus('saved');
      
      // بعد ثانية من saved، نرجع idle
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => {
        setStatus('idle');
      }, 1000);
    },
    [setAnswers, setLastSaved]
  );

  useEffect(() => {
    // التحقق من وجود بيانات حقيقية
    const hasData = Object.keys(data).some(
      (k) => data[k] !== undefined && data[k] !== '' && data[k] !== null
    );
    
    // التحقق إذا كانت البيانات قد تغيرت فعلاً
    const hasChanged = JSON.stringify(previousDataRef.current) !== JSON.stringify(data);
    previousDataRef.current = data;
    
    if (!hasData) {
      // لو مفيش بيانات، نتأكد أن الحالة idle
      if (status !== 'idle') {
        setStatus('idle');
      }
      // مسح أي timers موجودة
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // إذا لم تتغير البيانات، لا تفعل شيء
    if (!hasChanged) {
      return;
    }

    // تنظيف timer القديم
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // تغيير الحالة إلى saving
    setStatus('saving');
    
    // انتظار 2 ثانية (delay) ثم الحفظ
    timerRef.current = setTimeout(() => {
      save(data);
      timerRef.current = null;
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (savedTimerRef.current) {
        clearTimeout(savedTimerRef.current);
        savedTimerRef.current = null;
      }
    };
  }, [data, save, delay, status]);

  return { status };
}