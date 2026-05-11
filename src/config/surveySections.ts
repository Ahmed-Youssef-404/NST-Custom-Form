// config/surveySections.ts
import type { SurveySection } from '../types/survey';
import { generateAllSchemas } from '../utils/surveySchemaGenerator';

export const surveySections: SurveySection[] = [
  // القسم الأول: معلومات شخصية
  {
    id: 'personal',
    title: 'About You',
    subtitle: 'Tell us a bit about yourself',
    route: '/survey/personal',
    fields: [
      {
        id: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Ahmed Mohamed',
        required: false,
        validation: {
          required: 'Full name is required',
          minLength: { value: 3, message: 'Name must be at least 3 characters' },
        },
      },
      {
        id: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'ahmed@example.com',
        required: false,
        validation: {
          required: 'Email is required',
          email: 'Please enter a valid email address',
        },
      },
      {
        id: 'phone',
        label: 'Phone Number',
        type: 'phone',
        placeholder: '+20 123 456 7890',
        required: false,
        helperText: 'Optional - only for urgent contact',
        validation: {
          regex: {
            value: /^[\+\d\s\(\)\-]{10,15}$/,
            message: 'Enter a valid phone number',
          },
        },
      },
      {
        id: 'experience',
        label: 'Years of Experience',
        type: 'radio',
        required: true,
        options: [
          { label: '0-1 years', value: 'entry' },
          { label: '2-4 years', value: 'mid' },
          { label: '5-8 years', value: 'senior' },
          { label: '9+ years', value: 'expert' },
        ],
        validation: {
          required: 'Please select your experience level',
        },
      }
    ],
  },

  // القسم الثاني: المهارات والخبرات
  // {
  //   id: 'expertise',
  //   title: 'Your Expertise',
  //   subtitle: 'Tell us about your skills and experience',
  //   route: '/survey/expertise',
  //   fields: [
  //     {
  //       id: 'primaryDomain',
  //       label: 'Primary Domain',
  //       type: 'dropdown',
  //       placeholder: 'Select your domain',
  //       required: true,
  //       options: [
  //         { label: 'Web Development', value: 'web' },
  //         { label: 'Mobile Development', value: 'mobile' },
  //         { label: 'Data Science', value: 'data' },
  //         { label: 'DevOps', value: 'devops' },
  //         { label: 'UI/UX Design', value: 'design' },
  //       ],
  //       validation: {
  //         required: 'Please select your primary domain',
  //       },
  //     },
  //     {
  //       id: 'skills',
  //       label: 'Your Skills',
  //       type: 'tag-input',
  //       placeholder: 'Type a skill and press Enter',
  //       required: true,
  //       maxTags: 8,
  //       helperText: 'Add your key skills (max 8)',
  //       validation: {
  //         required: 'Please add at least one skill',
  //         maxTags: { value: 8, message: 'You can add up to 8 skills only' },
  //       },
  //     },
  //     {
  //       id: 'experience',
  //       label: 'Years of Experience',
  //       type: 'radio',
  //       required: true,
  //       options: [
  //         { label: '0-1 years', value: 'entry' },
  //         { label: '2-4 years', value: 'mid' },
  //         { label: '5-8 years', value: 'senior' },
  //         { label: '9+ years', value: 'expert' },
  //       ],
  //       validation: {
  //         required: 'Please select your experience level',
  //       },
  //     },
  //   ],
  // },

  // القسم الثالث: التقييم والملاحظات
  // {
  //   id: 'feedback',
  //   title: 'Feedback',
  //   subtitle: 'Help us improve',
  //   route: '/survey/feedback',
  //   fields: [
  //     {
  //       id: 'satisfaction',
  //       label: 'How satisfied are you?',
  //       type: 'rating',
  //       required: true,
  //       min: 1,
  //       max: 10,
  //       helperText: '1 = Not satisfied, 10 = Very satisfied',
  //       validation: {
  //         required: 'Please rate your satisfaction',
  //       },
  //     },
  //     {
  //       id: 'features',
  //       label: 'What features do you use most?',
  //       type: 'checkbox',
  //       required: true,
  //       options: [
  //         { label: 'Analytics Dashboard', value: 'analytics' },
  //         { label: 'API Access', value: 'api' },
  //         { label: 'Mobile App', value: 'mobile' },
  //         { label: 'Reporting Tools', value: 'reports' },
  //       ],
  //       validation: {
  //         required: 'Please select at least one feature',
  //       },
  //     },
  //     {
  //       id: 'suggestions',
  //       label: 'Any suggestions for improvement?',
  //       type: 'textarea',
  //       placeholder: 'Share your thoughts...',
  //       required: false,
  //       helperText: 'Optional - we appreciate your feedback!',
  //       validation: {
  //         maxLength: { value: 1000, message: 'Suggestion cannot exceed 1000 characters' },
  //       },
  //     },
  //   ],
  // },
];

export const TOTAL_SECTIONS = surveySections.length;
export const sectionSchemas = generateAllSchemas(surveySections);