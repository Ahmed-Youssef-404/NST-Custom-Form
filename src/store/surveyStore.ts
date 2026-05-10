import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SurveyAnswers } from '../types/survey';

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
  markSectionComplete: (sectionId: string) => void;
  setLastSaved: (timestamp: string) => void;
  startSurvey: () => void;
  resetSurvey: () => void;
  submitSurvey: () => void;
  hasUnfinishedSurvey: () => boolean;
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

      markSectionComplete: (sectionId) =>
        set((state) => ({
          completedSections: state.completedSections.includes(sectionId)
            ? state.completedSections
            : [...state.completedSections, sectionId],
        })),

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
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
