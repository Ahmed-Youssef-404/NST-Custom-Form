import { z } from 'zod';

export const personalSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name (at least 2 characters)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  bio: z.string().min(20, 'Please write at least 20 characters'),
  role: z.string().min(1, 'Please select your role'),
});

export const expertiseSchema = z.object({
  primaryDomain: z.string().min(1, 'Please select your primary domain'),
  skills: z
    .array(z.string())
    .min(1, 'Please add at least one skill')
    .max(10, 'Maximum 10 skills allowed'),
  workStyle: z
    .array(z.string())
    .min(1, 'Please select at least one work style'),
  experienceYears: z.string().min(1, 'Please select your experience range'),
});

export const feedbackSchema = z.object({
  satisfaction: z
    .number({ required_error: 'Please select a satisfaction rating' })
    .min(1)
    .max(10),
  topFeatures: z
    .array(z.string())
    .min(1, 'Please select at least one feature'),
  biggestChallenge: z.string().min(1, 'Please select a challenge'),
  futureIdeas: z.string().optional(),
});

export const sectionSchemas = [personalSchema, expertiseSchema, feedbackSchema];

export type PersonalData = z.infer<typeof personalSchema>;
export type ExpertiseData = z.infer<typeof expertiseSchema>;
export type FeedbackData = z.infer<typeof feedbackSchema>;
