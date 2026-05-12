// config/surveySections.ts
import type { SurveySection } from '../types/survey';
import { generateAllSchemas } from '../utils/surveySchemaGenerator';

export const surveySections: SurveySection[] = [
  // القسم الأول: معلومات شخصية
  {
    id: 'profile',
    title: 'About You',
    subtitle: 'Tell us a bit about yourself',
    route: '/survey/profile',
    fields: [
      {
        id: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Write your name here',
        required: true,
        validation: {
          required: 'Full name is required',
          minLength: { value: 3, message: 'Name must be at least 3 characters' },
        },
      },
      {
        id: 'phone',
        label: 'Phone Number (support whatsapp)',
        type: 'phone',
        placeholder: '+20 123 456 7890',
        required: true,
        validation: {
          regex: {
            value: /^(010|011|012|015)\d{8}$/,
            message: 'Enter a valid phone number',
          },
        },
      },
      {
        id: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'example@gmail.com',
        required: true,
        validation: {
          required: 'Email is required',
          // email: 'Please enter a valid email address',
          regex: {
            value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
            message: 'Enter a valid "@gmail.com" email address',
          },
        },
      },
      {
        id: 'university',
        label: 'University',
        type: 'text',
        placeholder: 'Write your university here',
        required: true,
      },
      {
        id: 'major',
        label: 'College / Major',
        type: 'text',
        placeholder: 'Write your major here',
        required: true,
      },
      {
        id: 'year',
        label: 'Academic Year',
        type: 'radio',
        required: true,
        options: [
          { label: 'preparatory', value: "preparatory" },
          { label: '1st', value: "1" },
          { label: '2nd', value: "2" },
          { label: '3rd', value: "3" },
          { label: '4th', value: "4" },
        ],
        validation: {
          required: 'Please select your academic year',
        },
      },
      {
        id: 'languages',
        label: 'Programming Languages you’ve worked with',
        type: 'tag-input',
        placeholder: 'ex: JavaScript, Python, Java, C++, C#, etc',
        helperText: 'press enter or comma to add',
        required: true,
        maxTags: 10,
        validation: {
          required: 'Please add at least one programming language',
          maxTags: { value: 10, message: 'You can add up to 10 languages only' },
        },
      }
    ],
  },

  {
    id: 'mindset',
    title: 'Mindset',
    subtitle: 'Understanding your approach and motivation',
    route: '/survey/mindset',
    fields: [
      {
        id: 'motivation',
        label: 'Why do you want to join the team?',
        type: 'textarea',
        required: true,
        validation: {
          minLength: { value: 1, message: 'This question is required' },
        },
      },
      {
        id: 'experience',
        label: 'Have you ever been part of a team activity or community before?',
        type: 'textarea',
        required: true,
        validation: {
          minLength: { value: 1, message: 'This question is required' },
        },
      },
      {
        id: 'availability',
        label: 'How many hours can you consistently dedicate each day to learning or working?',
        type: 'radio',
        required: true,
        options: [
          { label: '1-2 hours', value: "1-2" },
          { label: '3-4 hours', value: "3-4" },
          { label: 'more than 5 hours', value: "more" },
        ],
        validation: {
          required: 'Please select your availability',
        },
      },
      {
        id: 'independence',
        label: 'Do you prefer clear step-by-step guidance, or do you enjoy figuring things out on your own?',
        type: 'radio',
        required: true,
        options: [
          { label: 'Step-by-step guidance', value: "guidance" },
          { label: 'Figure things out on my own', value: "own" },
          { label: 'Mix of the two', value: "mix" },
        ],
        validation: {
          required: 'Please select your independence',
        },
      },
      {
        id: 'mentoring',
        label: 'Have you ever helped someone learn something before?',
        type: 'textarea',
        required: true,
        validation: {
          minLength: { value: 1, message: 'This question is required' },
        },
      },
    ],
  },


  {
    id: 'challenges',
    title: 'Challenges',
    subtitle: 'How you handle obstacles and challenges',
    route: '/survey/challenges',
    fields: [
      {
        id: 'consistency',
        label: 'If a skill takes 6 months to master, what would keep you motivated to continue? ',
        type: 'textarea',
        required: true,
        validation: {
          minLength: { value: 1, message: 'This question is required' },
        },
      },
      {
        id: 'discipline',
        label: 'How do you deal with tasks or subjects you don’t really enjoy?',
        type: 'textarea',
        required: true,
        validation: {
          minLength: { value: 1, message: 'This question is required' },
        },
      },
      {
        id: 'problem',
        label: 'When you face a problem and can’t find a solution, what do you usually do?:',
        type: 'textarea',
        required: true,
        validation: {
          minLength: { value: 1, message: 'This question is required' },
        },
      },
      {
        id: 'leadership',
        label: 'If you were leading a team and one member was clearly not contributing, how would you handle it?',
        type: 'textarea',
        required: true,
        validation: {
          minLength: { value: 1, message: 'This question is required' },
        },
      },
      {
        id: 'feedback',
        label: 'If you believe your team leader is making a mistake, what would you do?',
        type: 'textarea',
        required: true,
        validation: {
          minLength: { value: 1, message: 'This question is required' },
        },
      },
      {
        id: 'conflict',
        label: 'When disagreements happen within a team, how do you usually handle them?',
        type: 'textarea',
        required: true,
        validation: {
          minLength: { value: 1, message: 'This question is required' },
        },
      },
    ],
  },



  {
    id: 'evaluation',
    title: 'Evaluation',
    subtitle: 'Understanding your approach and motivation',
    route: '/survey/evaluation',
    fields: [
      {
        id: 'coding',
        label: 'Rate your current programming level:',
        type: 'rating',
        required: true,
        min: 1,
        max: 10,
        helperText: '1 = Low, 10 = Expert',
        validation: {
          required: 'Please rate your programming level',
        },
      },
      {
        id: 'problem-solving',
        label: 'Rate your problem-solving skills:',
        type: 'rating',
        required: true,
        min: 1,
        max: 10,
        helperText: '1 = Low, 10 = Expert',
        validation: {
          required: 'Please rate your problem-solving skills',
        },
      },
      {
        id: 'commitment',
        label: 'Rate your self-discipline:',
        type: 'rating',
        required: true,
        min: 1,
        max: 10,
        helperText: '1 = Low, 10 = Very disciplined',
        validation: {
          required: 'Please rate your self-discipline',
        },
      },
      {
        id: 'management',
        label: 'Rate your time management skills:',
        type: 'rating',
        required: true,
        min: 1,
        max: 10,
        helperText: '1 = Poor, 10 = Excellent',
        validation: {
          required: 'Please rate your time management skills',
        },
      },
      {
        id: 'teamwork',
        label: 'Rate your teamwork skills:',
        type: 'rating',
        required: true,
        min: 1,
        max: 10,
        helperText: '1 = Poor, 10 = Excellent',
        validation: {
          required: 'Please rate your teamwork skills',
        },
      },
      {
        id: 'leading',
        label: 'Rate your leading skills:',
        type: 'rating',
        required: true,
        min: 1,
        max: 10,
        helperText: '1 = Poor, 10 = Excellent',
        validation: {
          required: 'Please rate your leading skills',
        },
      },
      {
        id: 'speaking',
        label: 'Rate your speaking skills:',
        type: 'rating',
        required: true,
        min: 1,
        max: 10,
        helperText: '1 = Poor, 10 = Excellent',
        validation: {
          required: 'Please rate your speaking skills',
        },
      },

      {
        id: 'notes',
        label: "Any suggestions, thoughts, or anything else you'd like to share?",
        type: 'textarea',
        required: false,
      },
    ],
  },

];

export const TOTAL_SECTIONS = surveySections.length;
export const sectionSchemas = generateAllSchemas(surveySections);




//   {
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
//   ],
// },



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