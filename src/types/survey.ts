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

export interface ValidationRules {
  required?: string;    // رسالة مخصصة عند عدم وجود قيمة
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  email?: string;       // رسالة مخصصة لصيغة الإيميل
  regex?: { value: RegExp; message: string };
  maxTags?: { value: number; message: string };
  minTags?: { value: number; message: string };
}

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  helperText?: string;
  options?: FieldOption[];
  validation?: ValidationRules;  // سيتم استخدامه لتخصيص الرسائل
  // قد تبقى الخصائص القديمة للتوافق، لكن الأفضل استخدام validation
  min?: number;    // للتوافق مع الكود الحالي
  max?: number;
  minLength?: number;
  maxLength?: number;
  maxTags?: number;
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
