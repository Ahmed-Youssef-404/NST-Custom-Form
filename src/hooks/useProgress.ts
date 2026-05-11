// hooks/useProgress.ts
import { useMemo } from 'react';
import { useSurveyStore } from '../store/surveyStore';
import { surveySections } from '../config/surveySections';
import { isSectionComplete } from '../utils/surveyValidation';

// دالة لحساب عدد الحقول المطلوبة المملوءة في كل قسم
function countRequiredFilledFields(section: typeof surveySections[0], answers: Record<string, any>): number {
  const requiredFields = section.fields.filter(field => field.required === true);
  let filled = 0;
  
  for (const field of requiredFields) {
    const value = answers[field.id];
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) filled++;
      } else {
        filled++;
      }
    }
  }
  
  return filled;
}

function getTotalRequiredFields(): number {
  let total = 0;
  for (const section of surveySections) {
    total += section.fields.filter(field => field.required === true).length;
  }
  return total;
}

export function useProgress() {
  const { currentSectionIndex, answers } = useSurveyStore();
  
  const totalSections = surveySections.length;
  
  // الأقسام المكتملة (كل الحقول المطلوبة فيها مملوءة)
  const completedSections = useMemo(() => {
    const completed: string[] = [];
    for (let i = 0; i < totalSections; i++) {
      if (isSectionComplete(i, answers)) {
        completed.push(surveySections[i].id);
      }
    }
    return completed;
  }, [answers, totalSections]);
  
  // 🔥 تقدم بناءً على الحقول (field-based progress)
  const fieldBasedProgress = useMemo(() => {
    const totalRequiredFields = getTotalRequiredFields();
    if (totalRequiredFields === 0) return 0;
    
    let filledFields = 0;
    for (const section of surveySections) {
      filledFields += countRequiredFilledFields(section, answers);
    }
    
    return (filledFields / totalRequiredFields) * 100;
  }, [answers]);
  
  // التقدم على مستوى الأقسام (section-based progress)
  const sectionBasedProgress = useMemo(() => {
    return (completedSections.length / totalSections) * 100;
  }, [completedSections.length, totalSections]);
  
  return {
    currentSectionIndex,
    totalSections,
    completedSections,
    progressPercent: fieldBasedProgress, // دلوقتي بيستخدم التقدم بالحقول
    sectionBasedProgress, // لو عايز الاتنين
    fieldBasedProgress,
  };
}