// utils/surveySchemaGenerator.ts
import { z } from 'zod';
import type { SurveySection, Field } from '../types/survey';

function generateFieldSchema(field: Field): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'dropdown':
    case 'radio': {
      let stringSchema = z.string();
      if (field.minLength) stringSchema = stringSchema.min(field.minLength, `Must be at least ${field.minLength} characters`);
      if (field.maxLength) stringSchema = stringSchema.max(field.maxLength, `Must be at most ${field.maxLength} characters`);
      schema = stringSchema;
      break;
    }

    case 'email': {
      let emailSchema = z.string().email('Please enter a valid email address');
      if (field.minLength) emailSchema = emailSchema.min(field.minLength);
      if (field.maxLength) emailSchema = emailSchema.max(field.maxLength);
      schema = emailSchema;
      break;
    }

    case 'phone': {
      let phoneSchema = z.string().regex(/^[\+\d\s\(\)\-]+$/, 'Invalid phone number');
      if (field.minLength) phoneSchema = phoneSchema.min(field.minLength);
      if (field.maxLength) phoneSchema = phoneSchema.max(field.maxLength);
      schema = phoneSchema;
      break;
    }

    case 'tag-input': {
      let arraySchema = z.array(z.string());
      if (field.maxTags) arraySchema = arraySchema.max(field.maxTags, `Maximum ${field.maxTags} skills allowed`);
      schema = arraySchema;
      break;
    }

    case 'checkbox': {
      if (field.options) {
        schema = z.array(z.string());
      } else {
        schema = z.boolean();
      }
      break;
    }

    case 'rating': {
      let numberSchema = z.number().int();
      if (field.min !== undefined) numberSchema = numberSchema.min(field.min, `Minimum rating is ${field.min}`);
      if (field.max !== undefined) numberSchema = numberSchema.max(field.max, `Maximum rating is ${field.max}`);
      schema = numberSchema;
      break;
    }

    default:
      schema = z.any();
  }

  // إذا كان الحقل مطلوباً (required: true)
  if (field.required) {
    if (field.type === 'checkbox' && field.options) {
      schema = (schema as z.ZodArray<z.ZodString>).min(1, 'Please select at least one option');
    } else if (field.type === 'tag-input') {
      schema = (schema as z.ZodArray<z.ZodString>).min(1, 'Please add at least one skill');
    } else {
      // للأنواع الأخرى، نضيف refine
      schema = schema.refine(
        (val) => val !== undefined && val !== null && val !== '',
        { message: `${field.label} is required` }
      );
    }
  } else {
    // الحقول الاختيارية
    if (field.type === 'checkbox' && field.options) {
      schema = (schema as z.ZodArray<z.ZodString>).optional();
    } else if (field.type === 'tag-input') {
      schema = (schema as z.ZodArray<z.ZodString>).optional();
    } else if (field.type === 'rating') {
      schema = (schema as z.ZodNumber).optional();
    } else {
      schema = schema.optional();
    }
  }

  return schema;
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