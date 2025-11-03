export interface PsychologyQuestion {
  id: string;
  text: string;
  category: string;
  options: {
    text: string;
    style: 'Realistic' | 'Elaborate' | 'Short';
  }[];
}

export const psychologyQuestions: PsychologyQuestion[] = [
  // Resume Writing Style Questions
  {
    id: 'resume_1',
    text: 'When describing your achievements on a resume, you prefer to:',
    category: 'resume',
    options: [
      { text: 'List specific numbers and facts (increased sales by 25%)', style: 'Realistic' },
      { text: 'Tell the full story of how you achieved results with context', style: 'Elaborate' },
      { text: 'Keep it brief with key impact points only', style: 'Short' }
    ]
  },
  {
    id: 'resume_2',
    text: 'Your ideal resume summary would:',
    category: 'resume',
    options: [
      { text: 'Focus on proven track record with concrete examples', style: 'Realistic' },
      { text: 'Paint a comprehensive picture of your professional journey', style: 'Elaborate' },
      { text: 'Capture your value proposition in 2-3 lines', style: 'Short' }
    ]
  },
  {
    id: 'resume_3',
    text: 'When listing job responsibilities, you tend to:',
    category: 'resume',
    options: [
      { text: 'Include measurable outcomes and specific tools used', style: 'Realistic' },
      { text: 'Explain the context and broader impact of your work', style: 'Elaborate' },
      { text: 'Use bullet points with key actions only', style: 'Short' }
    ]
  },

  // Interview Communication Questions
  {
    id: 'interview_1',
    text: 'When explaining a complex project in an interview, you:',
    category: 'interview',
    options: [
      { text: 'Present clear facts, timelines, and measurable results', style: 'Realistic' },
      { text: 'Walk through the complete process and challenges faced', style: 'Elaborate' },
      { text: 'Give a concise overview hitting the main points', style: 'Short' }
    ]
  },
  {
    id: 'interview_2',
    text: 'Your approach to answering "Tell me about yourself" is:',
    category: 'interview',
    options: [
      { text: 'Share specific experiences and quantifiable achievements', style: 'Realistic' },
      { text: 'Tell your career story with personal insights and motivations', style: 'Elaborate' },
      { text: 'Deliver a focused elevator pitch about your value', style: 'Short' }
    ]
  },
  {
    id: 'interview_3',
    text: 'When discussing a failure or challenge, you prefer to:',
    category: 'interview',
    options: [
      { text: 'Focus on what you learned and concrete steps taken', style: 'Realistic' },
      { text: 'Explain the full situation and emotional journey', style: 'Elaborate' },
      { text: 'Briefly state the issue and immediate solution', style: 'Short' }
    ]
  },

  // Problem Solving Approach
  {
    id: 'problem_1',
    text: 'When describing how you solve problems, you emphasize:',
    category: 'problem_solving',
    options: [
      { text: 'Data-driven analysis and proven methodologies', style: 'Realistic' },
      { text: 'Collaborative process and creative thinking approaches', style: 'Elaborate' },
      { text: 'Quick decision-making and efficient execution', style: 'Short' }
    ]
  },
  {
    id: 'problem_2',
    text: 'Your ideal way to present a solution is:',
    category: 'problem_solving',
    options: [
      { text: 'Show evidence, metrics, and validation of results', style: 'Realistic' },
      { text: 'Explain the thought process and alternative considerations', style: 'Elaborate' },
      { text: 'Present the core solution with key benefits', style: 'Short' }
    ]
  },

  // Self-Description Style
  {
    id: 'self_1',
    text: 'When describing your strengths, you prefer to:',
    category: 'self_description',
    options: [
      { text: 'Give specific examples of when you demonstrated them', style: 'Realistic' },
      { text: 'Explain how they developed and their broader impact', style: 'Elaborate' },
      { text: 'Name them clearly with brief context', style: 'Short' }
    ]
  },
  {
    id: 'self_2',
    text: 'Your communication style in professional settings is:',
    category: 'self_description',
    options: [
      { text: 'Direct and fact-based with clear objectives', style: 'Realistic' },
      { text: 'Thoughtful and comprehensive with full context', style: 'Elaborate' },
      { text: 'Concise and action-oriented', style: 'Short' }
    ]
  },

  // Technical Explanation Style
  {
    id: 'technical_1',
    text: 'When explaining technical concepts to non-technical people:',
    category: 'technical',
    options: [
      { text: 'Use analogies grounded in real-world examples', style: 'Realistic' },
      { text: 'Build understanding step-by-step with detailed context', style: 'Elaborate' },
      { text: 'Focus on the essential points and practical impact', style: 'Short' }
    ]
  },
  {
    id: 'technical_2',
    text: 'Your preferred way to document technical work is:',
    category: 'technical',
    options: [
      { text: 'Include specific configurations, versions, and test results', style: 'Realistic' },
      { text: 'Provide comprehensive guides with background and reasoning', style: 'Elaborate' },
      { text: 'Create quick reference guides with key steps', style: 'Short' }
    ]
  },

  // Learning Style Preferences
  {
    id: 'learning_1',
    text: 'You prefer learning materials that are:',
    category: 'learning',
    options: [
      { text: 'Based on case studies and real-world applications', style: 'Realistic' },
      { text: 'Comprehensive with theoretical background and examples', style: 'Elaborate' },
      { text: 'Practical guides with actionable takeaways', style: 'Short' }
    ]
  },
  {
    id: 'learning_2',
    text: 'When preparing for interviews, you focus on:',
    category: 'learning',
    options: [
      { text: 'Practicing with actual interview questions and scenarios', style: 'Realistic' },
      { text: 'Understanding company culture and comprehensive preparation', style: 'Elaborate' },
      { text: 'Key talking points and essential preparation items', style: 'Short' }
    ]
  },

  // Professional Communication
  {
    id: 'communication_1',
    text: 'In professional emails, you typically:',
    category: 'communication',
    options: [
      { text: 'Include specific details, deadlines, and next steps', style: 'Realistic' },
      { text: 'Provide full context and background information', style: 'Elaborate' },
      { text: 'Get straight to the point with clear requests', style: 'Short' }
    ]
  },
  {
    id: 'communication_2',
    text: 'When presenting to stakeholders, you prefer to:',
    category: 'communication',
    options: [
      { text: 'Show data, metrics, and concrete evidence', style: 'Realistic' },
      { text: 'Tell the complete story with context and implications', style: 'Elaborate' },
      { text: 'Deliver key insights and recommendations clearly', style: 'Short' }
    ]
  },

  // Career Development
  {
    id: 'career_1',
    text: 'When discussing your career goals, you emphasize:',
    category: 'career',
    options: [
      { text: 'Specific roles, skills, and measurable milestones', style: 'Realistic' },
      { text: 'Your vision, values, and long-term aspirations', style: 'Elaborate' },
      { text: 'Clear objectives and practical next steps', style: 'Short' }
    ]
  },
  {
    id: 'career_2',
    text: 'Your approach to networking is:',
    category: 'career',
    options: [
      { text: 'Focus on mutual benefits and specific opportunities', style: 'Realistic' },
      { text: 'Build genuine relationships through shared interests', style: 'Elaborate' },
      { text: 'Make efficient connections with clear purpose', style: 'Short' }
    ]
  },

  // Decision Making
  {
    id: 'decision_1',
    text: 'When making important career decisions, you:',
    category: 'decision_making',
    options: [
      { text: 'Analyze data, pros/cons, and historical outcomes', style: 'Realistic' },
      { text: 'Consider all factors including personal values and impact', style: 'Elaborate' },
      { text: 'Trust your instincts and make decisive moves', style: 'Short' }
    ]
  }
];

// Utility function to get random questions
export const getRandomQuestions = (count: number = 10): PsychologyQuestion[] => {
  const shuffled = [...psychologyQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Utility function to calculate dominant style
export const calculateDominantStyle = (answers: ('Realistic' | 'Elaborate' | 'Short')[]): {
  dominantStyle: 'Realistic' | 'Elaborate' | 'Short';
  scores: { Realistic: number; Elaborate: number; Short: number };
  percentage: number;
} => {
  const scores = {
    Realistic: 0,
    Elaborate: 0,
    Short: 0
  };

  answers.forEach(answer => {
    scores[answer]++;
  });

  const dominantStyle = Object.entries(scores).reduce((a, b) => 
    scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
  )[0] as 'Realistic' | 'Elaborate' | 'Short';

  const percentage = Math.round((scores[dominantStyle] / answers.length) * 100);

  return { dominantStyle, scores, percentage };
};