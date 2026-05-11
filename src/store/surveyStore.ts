import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SurveyAnswers } from '../types/survey';
import { isSectionComplete } from '../utils/surveyValidation';
import { surveySections } from '../config/surveySections';

const STORAGE_KEY = 'survey_state_v1';

interface SurveyStore {
  answers: SurveyAnswers;
  currentSectionIndex: number;
  completedSections: string[];
  lastSaved: string | null;
  startedAt: string | null;
  isSubmitted: boolean;

  // Actions
  setAnswer: (key: string, value: unknown) => void;
  setAnswers: (answers: SurveyAnswers) => void;
  setCurrentSection: (index: number) => void;
  markSectionComplete: (sectionId: string, currentAnswers?: SurveyAnswers) => void;
  setLastSaved: (timestamp: string) => void;
  startSurvey: () => void;
  resetSurvey: () => void;
  submitSurvey: () => void;
  hasUnfinishedSurvey: () => boolean;
  isFullyCompleted: () => boolean;
}

const initialState = {
  answers: {},
  currentSectionIndex: 0,
  completedSections: [],
  lastSaved: null,
  startedAt: null,
  isSubmitted: false,
};

export const useSurveyStore = create<SurveyStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAnswer: (key, value) =>
        set((state) => ({
          answers: { ...state.answers, [key]: value },
        })),

      setAnswers: (answers) =>
        set((state) => ({
          answers: { ...state.answers, ...answers },
        })),

      setCurrentSection: (index) => set({ currentSectionIndex: index }),

      markSectionComplete: (sectionId: string, currentAnswers?: SurveyAnswers) =>
        set((state) => {
          const sectionIndex = surveySections.findIndex(s => s.id === sectionId);
          
          // If section not found, return unchanged state
          if (sectionIndex === -1) return state;

          // Check if section is actually completed using the answers
          const answersToCheck = currentAnswers || state.answers;
          const isCompleted = isSectionComplete(sectionIndex, answersToCheck);

          // Only mark as complete if validation passes
          if (!isCompleted) return state;

          // Add to completed sections if not already there
          return {
            completedSections: state.completedSections.includes(sectionId)
              ? state.completedSections
              : [...state.completedSections, sectionId],
          };
        }),

      setLastSaved: (timestamp) => set({ lastSaved: timestamp }),

      startSurvey: () =>
        set({
          startedAt: new Date().toISOString(),
          currentSectionIndex: 0,
        }),

      resetSurvey: () => {
        set({ ...initialState });
      },

      submitSurvey: () => set({ isSubmitted: true }),

      hasUnfinishedSurvey: () => {
        const { startedAt, isSubmitted, answers } = get();
        return (
          !!startedAt &&
          !isSubmitted &&
          Object.keys(answers).length > 0
        );
      },

      isFullyCompleted: () => {
        const { answers } = get();
        const totalSections = surveySections.length;
        
        // Check each section's required fields
        for (let i = 0; i < totalSections; i++) {
          if (!isSectionComplete(i, answers)) {
            return false;
          }
        }
        return true;
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);