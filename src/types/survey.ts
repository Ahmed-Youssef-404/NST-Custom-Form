export type FieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'textarea'
  | 'radio'
  | 'checkbox'
  | 'dropdown'
  | 'rating'
  | 'tag-input';

export interface FieldOption {
  label: string;
  value: string;
}

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  helperText?: string;
  options?: FieldOption[];
  min?: number;        // للـ rating أو النصوص
  max?: number;        // للـ rating أو عدد الـ tags
  minLength?: number;  // للنصوص
  maxLength?: number;
  maxTags?: number;
  // يمكنك إضافة المزيد حسب الحاجة
}

export interface SurveySection {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  fields: Field[];
}

export type SurveyAnswers = Record<string, any>;

export interface SurveyState {
  answers: SurveyAnswers;
  currentSectionIndex: number;
  completedSections: string[];
  lastSaved: string | null;
  startedAt: string | null;
}
