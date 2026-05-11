// utils/surveySchemaGenerator.ts
import { z } from 'zod';
import type { SurveySection, Field } from '../types/survey';

function generateFieldSchema(field: Field): z.ZodTypeAny {
  let baseSchema: z.ZodTypeAny;

  // بناء الـ base schema الأساسي (بدون required/optional)
  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'dropdown':
    case 'radio': {
      let stringSchema = z.string();
      if (field.minLength) stringSchema = stringSchema.min(field.minLength, `Must be at least ${field.minLength} characters`);
      if (field.maxLength) stringSchema = stringSchema.max(field.maxLength, `Must be at most ${field.maxLength} characters`);
      baseSchema = stringSchema;
      break;
    }

    case 'email': {
      let emailSchema = z.string().email('Please enter a valid email address');
      if (field.minLength) emailSchema = emailSchema.min(field.minLength);
      if (field.maxLength) emailSchema = emailSchema.max(field.maxLength);
      baseSchema = emailSchema;
      break;
    }

    case 'phone': {
      let phoneSchema = z.string().regex(/^[\+\d\s\(\)\-]+$/, 'Invalid phone number');
      if (field.minLength) phoneSchema = phoneSchema.min(field.minLength);
      if (field.maxLength) phoneSchema = phoneSchema.max(field.maxLength);
      baseSchema = phoneSchema;
      break;
    }

    case 'tag-input': {
      let arraySchema = z.array(z.string());
      if (field.maxTags) arraySchema = arraySchema.max(field.maxTags, `Maximum ${field.maxTags} skills allowed`);
      baseSchema = arraySchema;
      break;
    }

    case 'checkbox': {
      if (field.options) {
        baseSchema = z.array(z.string());
      } else {
        baseSchema = z.boolean();
      }
      break;
    }

    case 'rating': {
      let numberSchema = z.number().int();
      if (field.min !== undefined) numberSchema = numberSchema.min(field.min, `Minimum rating is ${field.min}`);
      if (field.max !== undefined) numberSchema = numberSchema.max(field.max, `Maximum rating is ${field.max}`);
      baseSchema = numberSchema;
      break;
    }

    default:
      baseSchema = z.any();
  }

  // ========== التعامل مع required vs optional مع conditional validation ==========
  
  if (field.required) {
    // الحقول المطلوبة: validation إلزامي
    if (field.type === 'checkbox' && field.options) {
      return (baseSchema as z.ZodArray<z.ZodString>).min(1, 'Please select at least one option');
    } else if (field.type === 'tag-input') {
      return (baseSchema as z.ZodArray<z.ZodString>).min(1, 'Please add at least one skill');
    } else {
      return baseSchema.refine(
        (val) => val !== undefined && val !== null && val !== '',
        { message: `${field.label} is required` }
      );
    }
  } else {
    // ========== الحقول الاختيارية: validation شرطي ==========
    // لو القيمة فاضية (undefined, null, empty string, empty array) → يعدي
    // لو القيمة فيها حاجة → يتطبق الـ validation
    
    if (field.type === 'checkbox' && field.options) {
      // checkbox array: لو فاضي يعدي، لو فيه حاجة يتأكد إنها array
      return z.preprocess(
        (val) => {
          if (Array.isArray(val) && val.length === 0) return undefined;
          return val;
        },
        (baseSchema as z.ZodArray<z.ZodString>).optional()
      );
    } else if (field.type === 'tag-input') {
      // tag-input: لو فاضي يعدي، لو فيه tags يتأكد من maxTags
      return z.preprocess(
        (val) => {
          if (Array.isArray(val) && val.length === 0) return undefined;
          return val;
        },
        (baseSchema as z.ZodArray<z.ZodString>).optional()
      );
    } else if (field.type === 'rating') {
      // rating: لو undefined يعدي، لو رقم يتأكد من min/max
      return z.preprocess(
        (val) => {
          if (val === undefined || val === null) return undefined;
          return val;
        },
        (baseSchema as z.ZodNumber).optional()
      );
    } else {
      // للنصوص والإيميل والفون: لو فاضي (empty string) يعدي، لو فيه نص يتطبق validation
      return z.preprocess(
        (val) => {
          // لو القيمة string فاضية حولها لـ undefined عشان تتخطى validation
          if (typeof val === 'string' && val.trim() === '') {
            return undefined;
          }
          return val;
        },
        baseSchema.optional()
      );
    }
  }
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