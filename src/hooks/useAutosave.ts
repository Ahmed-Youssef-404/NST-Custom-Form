import { useEffect, useRef, useState, useCallback } from 'react';
import { useSurveyStore } from '../store/surveyStore';

type AutosaveStatus = 'idle' | 'saving' | 'saved';

export function useAutosave(data: Record<string, unknown>, delay = 2000) {
  const [status, setStatus] = useState<AutosaveStatus>('idle');
  
  // Timer for waiting user to stop typing (debounce)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Timer for saving state duration
  const savingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Timer for saved state duration
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const previousDataRef = useRef<Record<string, unknown>>(data);
  const setLastSaved = useSurveyStore((s) => s.setLastSaved);
  const setAnswers = useSurveyStore((s) => s.setAnswers);

  // Clear all timers
  const clearAllTimers = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (savingTimerRef.current) {
      clearTimeout(savingTimerRef.current);
      savingTimerRef.current = null;
    }
    if (savedTimerRef.current) {
      clearTimeout(savedTimerRef.current);
      savedTimerRef.current = null;
    }
  }, []);

  // Actual save function
  const save = useCallback(
    (payload: Record<string, unknown>) => {
      setAnswers(payload);
      setLastSaved(new Date().toISOString());
      
      // Change to saved state
      setStatus('saved');
      
      // Clear any existing saved timer
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      
      // After 1 second, go back to idle
      savedTimerRef.current = setTimeout(() => {
        setStatus('idle');
        savedTimerRef.current = null;
      }, 1000);
    },
    [setAnswers, setLastSaved]
  );

  // Start the saving process (called after user stops typing)
  const startSaving = useCallback(
    (currentData: Record<string, unknown>) => {
      // Clear any existing saving timer
      if (savingTimerRef.current) {
        clearTimeout(savingTimerRef.current);
        savingTimerRef.current = null;
      }

      // Set status to saving
      setStatus('saving');
      
      // Wait for 2 seconds (delay), then save
      savingTimerRef.current = setTimeout(() => {
        save(currentData);
        savingTimerRef.current = null;
      }, delay);
    },
    [save, delay]
  );

  useEffect(() => {
    // Check if there's any meaningful data
    const hasData = Object.keys(data).some(
      (k) => data[k] !== undefined && data[k] !== '' && data[k] !== null
    );
    
    // Check if data has actually changed
    const hasChanged = JSON.stringify(previousDataRef.current) !== JSON.stringify(data);
    previousDataRef.current = data;
    
    if (!hasData) {
      // No data: go to idle and clear everything
      clearAllTimers();
      if (status !== 'idle') {
        setStatus('idle');
      }
      return;
    }

    // If data hasn't changed, do nothing
    if (!hasChanged) {
      return;
    }

    // User is typing - reset the debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // If currently saving or saved, don't interrupt
    // Just reset the debounce timer to wait for user to stop typing
    if (status === 'saving' || status === 'saved') {
      // We're in the middle of saving/saved, just reset the debounce
      // so we don't trigger another save right away
      debounceTimerRef.current = setTimeout(() => {
        // User has stopped typing for 1 second
        // But if we're already saved, don't save again
        if (status !== 'saved') {
          startSaving(data);
        }
        debounceTimerRef.current = null;
      }, 1000);
      return;
    }

    // Idle state - user is typing
    // Wait for user to stop typing for 1 second
    debounceTimerRef.current = setTimeout(() => {
      // User has stopped typing for 1 second, start the saving process
      startSaving(data);
      debounceTimerRef.current = null;
    }, 1000);

    return () => {
      // Cleanup on unmount or data change
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [data, startSaving, status, clearAllTimers]);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return { status };
}