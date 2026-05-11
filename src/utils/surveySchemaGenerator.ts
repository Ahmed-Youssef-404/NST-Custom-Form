// utils/surveySchemaGenerator.ts
import { z } from 'zod';
import type { SurveySection, Field } from '../types/survey';

// دالة مساعدة لاستخراج رسالة أو قيمة من validation
function getValidationMessageOrValue(
  validation: any,
  key: string,
  defaultValue: any
): any {
  if (!validation) return defaultValue;
  const rule = validation[key];
  if (typeof rule === 'object' && rule !== null) {
    return { value: rule.value, message: rule.message };
  }
  if (rule !== undefined) return rule;
  return defaultValue;
}

function generateFieldSchema(field: Field): z.ZodTypeAny {
  const { type, required, validation } = field;
  const isRequired = required === true;
  
  let baseSchema: z.ZodTypeAny;

  // بناء الـ base schema حسب النوع
  switch (type) {
    case 'text':
    case 'textarea':
    case 'dropdown':
    case 'radio': {
      let stringSchema = z.string();
      const minLength = getValidationMessageOrValue(validation, 'minLength', null);
      if (minLength) {
        if (typeof minLength === 'object') {
          stringSchema = stringSchema.min(minLength.value, minLength.message);
        } else {
          stringSchema = stringSchema.min(minLength, `Must be at least ${minLength} characters`);
        }
      }
      const maxLength = getValidationMessageOrValue(validation, 'maxLength', null);
      if (maxLength) {
        if (typeof maxLength === 'object') {
          stringSchema = stringSchema.max(maxLength.value, maxLength.message);
        } else {
          stringSchema = stringSchema.max(maxLength, `Must be at most ${maxLength} characters`);
        }
      }
      baseSchema = stringSchema;
      break;
    }

    case 'email': {
      let emailSchema = z.string();
      const emailMsg = getValidationMessageOrValue(validation, 'email', null);
      if (emailMsg) {
        if (typeof emailMsg === 'string') {
          emailSchema = emailSchema.email(emailMsg);
        } else if (emailMsg === true) {
          emailSchema = emailSchema.email('Please enter a valid email address');
        }
      } else {
        emailSchema = emailSchema.email('Invalid email');
      }
      const minLength = getValidationMessageOrValue(validation, 'minLength', null);
      if (minLength) {
        if (typeof minLength === 'object') {
          emailSchema = emailSchema.min(minLength.value, minLength.message);
        } else {
          emailSchema = emailSchema.min(minLength);
        }
      }
      baseSchema = emailSchema;
      break;
    }

    case 'phone': {
      let phoneSchema = z.string();
      const regexRule = getValidationMessageOrValue(validation, 'regex', null);
      if (regexRule) {
        phoneSchema = phoneSchema.regex(regexRule.value, regexRule.message);
      } else {
        phoneSchema = phoneSchema.regex(/^[\+\d\s\(\)\-]+$/, 'Invalid phone number');
      }
      baseSchema = phoneSchema;
      break;
    }

    case 'tag-input': {
      let arraySchema = z.array(z.string());
      const maxTags = getValidationMessageOrValue(validation, 'maxTags', null);
      if (maxTags) {
        if (typeof maxTags === 'object') {
          arraySchema = arraySchema.max(maxTags.value, maxTags.message);
        } else {
          arraySchema = arraySchema.max(maxTags, `Maximum ${maxTags} skills allowed`);
        }
      }
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
      // 🔥 اصلاح الـ rating: نبدأ بـ z.number() عادي
      let numberSchema = z.number();
      
      // نجيب min و max من validation أو من field
      const minVal = getValidationMessageOrValue(validation, 'min', field.min);
      if (minVal !== undefined && minVal !== null) {
        if (typeof minVal === 'object') {
          numberSchema = numberSchema.min(minVal.value, minVal.message);
        } else {
          numberSchema = numberSchema.min(minVal, `Minimum rating is ${minVal}`);
        }
      }
      
      const maxVal = getValidationMessageOrValue(validation, 'max', field.max);
      if (maxVal !== undefined && maxVal !== null) {
        if (typeof maxVal === 'object') {
          numberSchema = numberSchema.max(maxVal.value, maxVal.message);
        } else {
          numberSchema = numberSchema.max(maxVal, `Maximum rating is ${maxVal}`);
        }
      }
      
      // نجعلها int (اختياري)
      numberSchema = numberSchema.int();
      baseSchema = numberSchema;
      break;
    }

    default:
      baseSchema = z.any();
  }

  // ========== التعامل مع required والـ optional ==========
  const requiredMsg = getValidationMessageOrValue(validation, 'required', null);
  const isFieldRequired = isRequired || !!requiredMsg;
  const finalRequiredMessage = typeof requiredMsg === 'string' ? requiredMsg : `${field.label} is required`;

  // لو الحقل مطلوب
  if (isFieldRequired) {
    if (type === 'checkbox' && field.options) {
      return (baseSchema as z.ZodArray<z.ZodString>).min(1, finalRequiredMessage);
    } else if (type === 'tag-input') {
      return (baseSchema as z.ZodArray<z.ZodString>).min(1, finalRequiredMessage);
    } else if (type === 'rating') {
      // 🔥 حل مشكلة الـ rating المطلوب: نستخدم refine لمنع undefined/null
      return z.preprocess(
        (val) => {
          // لو القيمة undefined أو null، نرجعلها undefined (الـ refine هيمنعها)
          if (val === undefined || val === null) return val;
          // لو كانت string (من بعض الـ events)، نحولها لـ number
          if (typeof val === 'string') return Number(val);
          return val;
        },
        baseSchema.refine((val) => val !== undefined && val !== null, {
          message: finalRequiredMessage,
        })
      );
    } else {
      return baseSchema.refine(
        (val) => val !== undefined && val !== null && val !== '',
        { message: finalRequiredMessage }
      );
    }
  } 
  
  // الحقول الاختيارية
  else {
    if (type === 'checkbox' && field.options) {
      return z.preprocess(
        (val) => (!val || (Array.isArray(val) && val.length === 0)) ? undefined : val,
        baseSchema.optional()
      );
    } else if (type === 'tag-input') {
      return z.preprocess(
        (val) => (!val || (Array.isArray(val) && val.length === 0)) ? undefined : val,
        baseSchema.optional()
      );
    } else if (type === 'rating') {
      // 🔥 الـ rating الاختياري: يسمح بـ undefined/null
      return z.preprocess(
        (val) => {
          if (val === undefined || val === null) return undefined;
          if (typeof val === 'string') return Number(val);
          return val;
        },
        baseSchema.optional()
      );
    } else if (type === 'radio' || type === 'dropdown') {
      return z.preprocess(
        (val) => (val === undefined || val === null || val === '') ? undefined : val,
        baseSchema.optional()
      );
    } else {
      return z.preprocess(
        (val) => (typeof val === 'string' && val.trim() === '') ? undefined : val,
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