import { useState, useCallback } from 'react';

interface ExtractedResumeData {
  skills: string[];
  experience: string[];
  location: string;
  jobTitle: string;
  education: string[];
}

export const useResumeParser = () => {
  const [extractedData, setExtractedData] = useState<ExtractedResumeData | null>(null);
  const [parsing, setParsing] = useState(false);

  const parseResume = useCallback(async (resumeText: string) => {
    setParsing(true);
    
    try {
      // Simple resume parsing logic - can be enhanced with AI later
      const skillKeywords = [
        'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js',
        'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
        'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap', 'Tailwind',
        'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Firebase',
        'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
        'Git', 'Jenkins', 'CI/CD', 'REST API', 'GraphQL', 'Microservices'
      ];

      const locationKeywords = [
        'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 
        'Pune', 'Kolkata', 'Gurgaon', 'Noida', 'Ahmedabad'
      ];

      const jobTitleKeywords = [
        'Software Developer', 'Frontend Developer', 'Backend Developer',
        'Full Stack Developer', 'Software Engineer', 'DevOps Engineer',
        'React Developer', 'Node.js Developer', 'Java Developer',
        'Python Developer', 'Web Developer', 'Mobile Developer'
      ];

      // Extract skills
      const foundSkills = skillKeywords.filter(skill => 
        resumeText.toLowerCase().includes(skill.toLowerCase())
      );

      // Extract location
      const foundLocation = locationKeywords.find(location => 
        resumeText.toLowerCase().includes(location.toLowerCase())
      ) || 'India';

      // Extract job title
      const foundJobTitle = jobTitleKeywords.find(title => 
        resumeText.toLowerCase().includes(title.toLowerCase())
      ) || 'Software Developer';

      // Extract years of experience (simple regex)
      const experienceMatch = resumeText.match(/(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?experience/i);
      const experienceYears = experienceMatch ? parseInt(experienceMatch[1]) : 0;
      
      let experienceLevel = '';
      if (experienceYears <= 2) experienceLevel = 'entry';
      else if (experienceYears <= 5) experienceLevel = 'mid';
      else if (experienceYears <= 8) experienceLevel = 'senior';
      else experienceLevel = 'lead';

      const extracted: ExtractedResumeData = {
        skills: foundSkills.slice(0, 8), // Limit to 8 skills
        experience: [experienceLevel],
        location: foundLocation,
        jobTitle: foundJobTitle,
        education: [] // Can be enhanced later
      };

      setExtractedData(extracted);
      return extracted;
    } catch (error) {
      console.error('Resume parsing error:', error);
      return null;
    } finally {
      setParsing(false);
    }
  }, []);

  const clearExtractedData = useCallback(() => {
    setExtractedData(null);
  }, []);

  // Mock function to simulate having resume data
  const simulateResumeData = useCallback(() => {
    const mockData: ExtractedResumeData = {
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
      experience: ['mid'],
      location: 'Bangalore',
      jobTitle: 'Full Stack Developer',
      education: ['B.Tech Computer Science']
    };
    setExtractedData(mockData);
    return mockData;
  }, []);

  return {
    extractedData,
    parsing,
    parseResume,
    clearExtractedData,
    simulateResumeData
  };
};