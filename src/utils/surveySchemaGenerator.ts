// utils/surveySchemaGenerator.ts
import { z } from 'zod';
import type { SurveySection, Field } from '../types/survey';

function getValidationMessage(field: Field, rule: string, defaultMessage: string): string {
  const val = field.validation?.[rule as keyof typeof field.validation];
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val && 'message' in val) return val.message;
  return defaultMessage;
}

function generateFieldSchema(field: Field): z.ZodTypeAny {
  let baseSchema: z.ZodTypeAny;

  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'dropdown':
    case 'radio': {
      let stringSchema = z.string();
      const minLen = field.validation?.minLength?.value ?? field.minLength;
      if (minLen) {
        const msg = getValidationMessage(field, 'minLength', `Must be at least ${minLen} characters`);
        stringSchema = stringSchema.min(minLen, msg);
      }
      const maxLen = field.validation?.maxLength?.value ?? field.maxLength;
      if (maxLen) {
        const msg = getValidationMessage(field, 'maxLength', `Must be at most ${maxLen} characters`);
        stringSchema = stringSchema.max(maxLen, msg);
      }
      baseSchema = stringSchema;
      break;
    }
    case 'email': {
      let emailSchema = z.string();
      const minLen = field.validation?.minLength?.value ?? field.minLength;
      if (minLen) {
        const msg = getValidationMessage(field, 'minLength', `Must be at least ${minLen} characters`);
        emailSchema = emailSchema.min(minLen, msg);
      }
      const maxLen = field.validation?.maxLength?.value ?? field.maxLength;
      if (maxLen) {
        const msg = getValidationMessage(field, 'maxLength', `Must be at most ${maxLen} characters`);
        emailSchema = emailSchema.max(maxLen, msg);
      }
      const emailMsg = field.validation?.email || 'Please enter a valid email address';
      emailSchema = emailSchema.email(emailMsg);
      baseSchema = emailSchema;
      break;
    }
    case 'phone': {
      let phoneSchema = z.string();
      const regexVal = field.validation?.regex?.value || /^[\+\d\s\(\)\-]+$/;
      const regexMsg = field.validation?.regex?.message || 'Invalid phone number format';
      phoneSchema = phoneSchema.regex(regexVal, regexMsg);
      const minLen = field.validation?.minLength?.value ?? field.minLength;
      if (minLen) phoneSchema = phoneSchema.min(minLen, getValidationMessage(field, 'minLength', `Minimum ${minLen} digits required`));
      const maxLen = field.validation?.maxLength?.value ?? field.maxLength;
      if (maxLen) phoneSchema = phoneSchema.max(maxLen, getValidationMessage(field, 'maxLength', `Maximum ${maxLen} digits allowed`));
      baseSchema = phoneSchema;
      break;
    }
    case 'tag-input': {
      let arraySchema = z.array(z.string());
      const maxTagsVal = field.validation?.maxTags?.value ?? field.maxTags;
      if (maxTagsVal) {
        const msg = getValidationMessage(field, 'maxTags', `Maximum ${maxTagsVal} skills allowed`);
        arraySchema = arraySchema.max(maxTagsVal, msg);
      }
      const minTagsVal = field.validation?.minTags?.value;
      if (minTagsVal) {
        const msg = getValidationMessage(field, 'minTags', `Please add at least ${minTagsVal} skill`);
        arraySchema = arraySchema.min(minTagsVal, msg);
      }
      baseSchema = arraySchema;
      break;
    }
    case 'checkbox': {
      if (field.options) {
        baseSchema = z.array(z.string());
        // إذا كان مطلوباً سيتم التعامل مع min لاحقاً
      } else {
        baseSchema = z.boolean();
      }
      break;
    }
    case 'rating': {
      let numberSchema = z.number().int();
      const minVal = field.validation?.min?.value ?? field.min;
      if (minVal !== undefined) {
        const msg = getValidationMessage(field, 'min', `Minimum rating is ${minVal}`);
        numberSchema = numberSchema.min(minVal, msg);
      }
      const maxVal = field.validation?.max?.value ?? field.max;
      if (maxVal !== undefined) {
        const msg = getValidationMessage(field, 'max', `Maximum rating is ${maxVal}`);
        numberSchema = numberSchema.max(maxVal, msg);
      }
      baseSchema = numberSchema;
      break;
    }
    default:
      baseSchema = z.any();
  }

  // معالجة required و optional مع دعم الرسائل المخصصة
  if (field.required) {
    const requiredMsg = field.validation?.required || `${field.label} is required`;
    if (field.type === 'checkbox' && field.options) {
      baseSchema = (baseSchema as z.ZodArray<z.ZodString>).min(1, requiredMsg);
    } else if (field.type === 'tag-input') {
      baseSchema = (baseSchema as z.ZodArray<z.ZodString>).min(1, requiredMsg);
    } else if (field.type === 'rating') {
      baseSchema = baseSchema.refine((val) => val !== undefined && val !== null, { message: requiredMsg });
    } else {
      baseSchema = baseSchema.refine((val) => val !== undefined && val !== null && val !== '', { message: requiredMsg });
    }
  } else {
    // معالجة اختيارية مع الاحتفاظ بالقواعد الشرطية (كما في السابق)
    if (field.type === 'checkbox' && field.options) {
      baseSchema = z.preprocess(
        (val) => (Array.isArray(val) && val.length === 0) ? undefined : val,
        baseSchema.optional()
      );
    } else if (field.type === 'tag-input') {
      baseSchema = z.preprocess(
        (val) => (Array.isArray(val) && val.length === 0) ? undefined : val,
        baseSchema.optional()
      );
    } else if (field.type === 'rating') {
      baseSchema = z.preprocess(
        (val) => (val === undefined || val === null) ? undefined : val,
        baseSchema.optional()
      );
    } else if (field.type === 'radio' || field.type === 'dropdown') {
      baseSchema = z.preprocess(
        (val) => (val === undefined || val === null || val === '') ? undefined : val,
        baseSchema.optional()
      );
    } else {
      baseSchema = z.preprocess(
        (val) => (typeof val === 'string' && val.trim() === '') ? undefined : val,
        baseSchema.optional()
      );
    }
  }

  return baseSchema;
}

export function generateSectionSchema(section: SurveySection): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of section.fields) {
    shape[field.id] = generateFieldSchema(field);
  }
  return z.object(shape);
}

export function generateAllSchemas(sections: SurveySection[]): z.ZodObject<any>[] {
  return sections.map(section => generateSectionSchema(section));
}