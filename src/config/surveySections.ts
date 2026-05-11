// config/surveySections.ts
import type { SurveySection } from '../types/survey';
import { generateAllSchemas } from '../utils/surveySchemaGenerator';

export const surveySections: SurveySection[] = [
  {
    id: 'personal',
    title: 'About You',
    subtitle: "Let's start with the basics. We keep this private.",
    route: '/survey/personal',
    fields: [
      {
        id: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Your full name',
        required: true,
        helperText: 'As it appears on your profile',
        minLength: 2,
      },
      {
        id: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'hello@example.com',
        required: false,
      },
      {
        id: 'phone',
        label: 'Phone Number',
        type: 'phone',
        placeholder: '+1 (555) 000-0000',
        required: true,
        minLength: 10,
      },
      {
        id: 'bio',
        label: 'Short Bio',
        type: 'textarea',
        placeholder: 'Tell us a little about yourself...',
        required: false,
        helperText: 'A brief description — 2 to 4 sentences.',
        minLength: 20,
      },
      {
        id: 'role',
        label: 'Your Role',
        type: 'radio',
        required: true,
        options: [
          { label: 'Individual Contributor', value: 'ic' },
          { label: 'Team Lead', value: 'lead' },
          { label: 'Manager / Director', value: 'manager' },
          { label: 'Executive / C-Suite', value: 'executive' },
          { label: 'Freelancer / Consultant', value: 'freelancer' },
        ],
      },
    ],
  },
  {
    id: 'expertise',
    title: 'Your Expertise',
    subtitle: 'Help us understand your skills and experience depth.',
    route: '/survey/expertise',
    fields: [
      {
        id: 'primaryDomain',
        label: 'Primary Domain',
        type: 'dropdown',
        placeholder: 'Select your domain',
        required: true,
        options: [
          { label: 'Software Engineering', value: 'software' },
          { label: 'Product Management', value: 'product' },
          { label: 'Design & UX', value: 'design' },
          { label: 'Data Science / ML', value: 'data' },
          { label: 'Marketing', value: 'marketing' },
          { label: 'Operations', value: 'operations' },
          { label: 'Finance', value: 'finance' },
          { label: 'Other', value: 'other' },
        ],
      },
      {
        id: 'skills',
        label: 'Key Skills',
        type: 'tag-input',
        placeholder: 'Type a skill and press Enter',
        required: true,
        maxTags: 10,
        helperText: 'Add up to 10 skills. Press Enter or comma to add.',
      },
      {
        id: 'workStyle',
        label: 'How Do You Prefer to Work?',
        type: 'checkbox',
        required: true,
        options: [
          { label: 'Remote-first', value: 'remote' },
          { label: 'In-office', value: 'office' },
          { label: 'Hybrid model', value: 'hybrid' },
          { label: 'Async communication', value: 'async' },
          { label: 'Real-time collaboration', value: 'realtime' },
          { label: 'Deep focus blocks', value: 'deepwork' },
        ],
      },
      {
        id: 'experienceYears',
        label: 'Years of Experience',
        type: 'radio',
        required: true,
        options: [
          { label: 'Less than 1 year', value: 'lt1' },
          { label: '1 – 3 years', value: '1to3' },
          { label: '3 – 7 years', value: '3to7' },
          { label: '7 – 12 years', value: '7to12' },
          { label: '12+ years', value: 'gt12' },
        ],
      },
    ],
  },
  {
    id: 'feedback',
    title: 'Feedback & Vision',
    subtitle: 'Your honest perspective shapes what we build next.',
    route: '/survey/feedback',
    fields: [
      {
        id: 'satisfaction',
        label: 'Overall Satisfaction',
        type: 'rating',
        required: true,
        min: 1,
        max: 10,
        helperText: '1 = Not satisfied at all, 10 = Extremely satisfied',
      },
      {
        id: 'topFeatures',
        label: 'Most Valued Features',
        type: 'checkbox',
        required: true,
        options: [
          { label: 'Performance & Speed', value: 'performance' },
          { label: 'Design & Aesthetics', value: 'design' },
          { label: 'Developer Experience', value: 'dx' },
          { label: 'Documentation Quality', value: 'docs' },
          { label: 'Community & Support', value: 'community' },
          { label: 'Pricing & Value', value: 'pricing' },
        ],
      },
      {
        id: 'biggestChallenge',
        label: 'Biggest Challenge You Face',
        type: 'dropdown',
        placeholder: 'Select the closest match',
        required: true,
        options: [
          { label: 'Scaling the team', value: 'scaling' },
          { label: 'Technical debt', value: 'tech_debt' },
          { label: 'Cross-team alignment', value: 'alignment' },
          { label: 'Hiring the right talent', value: 'hiring' },
          { label: 'Shipping fast enough', value: 'velocity' },
          { label: 'Maintaining quality', value: 'quality' },
        ],
      },
      {
        id: 'futureIdeas',
        label: 'Ideas for the Future',
        type: 'textarea',
        placeholder: 'Share any ideas, requests, or feedback you have...',
        required: false,
        helperText: 'No character limit. Be as detailed as you like.',
      },
    ],
  },
];

export const TOTAL_SECTIONS = surveySections.length;

// Generate Zod schemas automatically from the sections
export const sectionSchemas = generateAllSchemas(surveySections);