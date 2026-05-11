// utils/surveyValidation.ts
import { sectionSchemas } from '@/config/surveySections';
import type { SurveyAnswers } from '../types/survey';

export function isSectionComplete(
  sectionIndex: number,
  answers: SurveyAnswers
): boolean {
  if (sectionIndex < 0 || sectionIndex >= sectionSchemas.length) return false;
  const schema = sectionSchemas[sectionIndex];
  const result = schema.safeParse(answers);
  return result.success;
}

export function isFormFullyCompleted(
  answers: SurveyAnswers,
  totalSections: number
): boolean {
  for (let i = 0; i < totalSections; i++) {
    if (!isSectionComplete(i, answers)) return false;
  }
  return true;
}