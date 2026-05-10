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

export interface SurveyField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  min?: number;
  max?: number;
  maxTags?: number;
  rows?: number;
  helperText?: string;
}

export interface SurveySection {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  fields: SurveyField[];
}

export type SurveyAnswers = Record<string, unknown>;

export interface SurveyState {
  answers: SurveyAnswers;
  currentSectionIndex: number;
  completedSections: string[];
  lastSaved: string | null;
  startedAt: string | null;
}
