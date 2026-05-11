import React from 'react';
import type { Field, FieldType } from '../../types/survey';
import { TextField } from './TextField';
import { TextAreaField } from './TextAreaField';
import { RadioField } from './RadioField';
import { CheckboxField } from './CheckboxField';
import { DropdownField } from './DropdownField';
import { RatingField } from './RatingField';
import { TagInputField } from './TagInputField';

type FieldComponent = React.ComponentType<{ field: Field }>;

const fieldRegistry: Record<FieldType, FieldComponent> = {
  text: TextField,
  email: TextField,
  phone: TextField,
  textarea: TextAreaField,
  radio: RadioField,
  checkbox: CheckboxField,
  dropdown: DropdownField,
  rating: RatingField,
  'tag-input': TagInputField,
};

interface Props {
  field: Field;
}

export function FieldRenderer({ field }: Props) {
  const Component = fieldRegistry[field.type];

  if (!Component) {
    console.warn(`No renderer found for field type: "${field.type}"`);
    return null;
  }

  return <Component field={field} />;
}
