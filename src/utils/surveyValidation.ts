// utils/surveyValidation.ts
import { expertiseSchema, feedbackSchema, personalSchema } from '@/schemas/sectionSchemas';
import type { SurveyAnswers } from '../types/survey';

// ترتيب الأقسام كما هو في array
const schemasInOrder = [personalSchema, expertiseSchema, feedbackSchema];

export function isSectionComplete(
  sectionIndex: number,
  answers: SurveyAnswers
): boolean {
  if (sectionIndex >= schemasInOrder.length) return false;
  
  const schema = schemasInOrder[sectionIndex];
  const result = schema.safeParse(answers);
  
  return result.success;
}

export function isFormFullyCompleted(
  answers: SurveyAnswers,
  totalSections: number
): boolean {
  for (let i = 0; i < totalSections; i++) {
    if (!isSectionComplete(i, answers)) {
      return false;
    }
  }
  return true;
}