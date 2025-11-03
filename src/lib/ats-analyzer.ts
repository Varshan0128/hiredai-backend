// Enhanced ATS Analyzer with Advanced NLP-like Features
// This module provides sophisticated resume and job description analysis

export interface ResumeSection {
  type: 'contact' | 'summary' | 'experience' | 'education' | 'skills' | 'certifications' | 'projects' | 'achievements';
  content: string;
  keywords: string[];
  importance: number; // 0-1 scale
}

export interface JobRequirement {
  type: 'skill' | 'experience' | 'education' | 'certification' | 'soft_skill';
  text: string;
  importance: number; // 0-1 scale
  required: boolean;
}

export interface ATSScoreBreakdown {
  skillsMatch: number;        // 40% weight
  experienceMatch: number;   // 30% weight  
  educationMatch: number;     // 15% weight
  formattingScore: number;   // 15% weight
  overallScore: number;
}

export interface ATSAnalysis {
  score: ATSScoreBreakdown;
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  formattingIssues: string[];
  semanticMatches: Array<{
    resumeText: string;
    jobText: string;
    similarity: number;
  }>;
}

// Advanced text preprocessing
export class TextProcessor {
  static cleanText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove special characters
      .replace(/\s+/g, ' ')     // Normalize whitespace
      .trim();
  }

  static extractKeywords(text: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall'
    ]);

    return text
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .map(word => word.replace(/[^\w]/g, ''))
      .filter(word => word.length > 0);
  }

  static calculateSemanticSimilarity(text1: string, text2: string): number {
    const words1 = this.extractKeywords(text1);
    const words2 = this.extractKeywords(text2);
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  static extractSkills(text: string): string[] {
    const skillPatterns = [
      // Programming languages
      /\b(javascript|python|java|c\+\+|c#|php|ruby|go|rust|swift|kotlin|typescript|scala|r|matlab)\b/gi,
      // Frameworks
      /\b(react|angular|vue|node\.?js|express|django|flask|spring|laravel|rails|asp\.net|jquery|bootstrap|tailwind)\b/gi,
      // Databases
      /\b(mysql|postgresql|mongodb|redis|elasticsearch|sqlite|oracle|sql server|dynamodb)\b/gi,
      // Cloud & DevOps
      /\b(aws|azure|gcp|docker|kubernetes|jenkins|git|ci\/cd|terraform|ansible)\b/gi,
      // Tools & Technologies
      /\b(figma|sketch|photoshop|illustrator|tableau|power bi|excel|word|powerpoint)\b/gi,
      // Soft skills
      /\b(leadership|communication|teamwork|problem solving|analytical|creative|adaptable|leadership|management)\b/gi
    ];

    const skills = new Set<string>();
    
    skillPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => skills.add(match.toLowerCase()));
      }
    });

    return Array.from(skills);
  }

  static extractExperience(text: string): Array<{role: string, company: string, duration: string}> {
    const experiencePattern = /(?:worked|experience|employed|position|role|job).*?(?:at|in|for|with)\s+([^,]+)(?:,|\s+for|\s+from|\s+to|\s+until)/gi;
    const experiences: Array<{role: string, company: string, duration: string}> = [];
    
    let match;
    while ((match = experiencePattern.exec(text)) !== null) {
      experiences.push({
        role: match[0].split(/at|in|for|with/)[0].trim(),
        company: match[1].trim(),
        duration: '' // Would need more complex parsing for actual dates
      });
    }
    
    return experiences;
  }

  static extractEducation(text: string): Array<{degree: string, institution: string, year?: string}> {
    const educationPattern = /(?:bachelor|master|phd|doctorate|degree|diploma|certificate|university|college|institute).*?(?:in|of|from)\s+([^,]+)/gi;
    const education: Array<{degree: string, institution: string, year?: string}> = [];
    
    let match;
    while ((match = educationPattern.exec(text)) !== null) {
      education.push({
        degree: match[0].split(/in|of|from/)[0].trim(),
        institution: match[1].trim(),
        year: undefined
      });
    }
    
    return education;
  }
}

// Advanced ATS Analyzer
export class ATSAnalyzer {
  private resumeText: string;
  private jobDescription: string;

  constructor(resumeText: string, jobDescription: string) {
    this.resumeText = TextProcessor.cleanText(resumeText);
    this.jobDescription = TextProcessor.cleanText(jobDescription);
  }

  analyze(): ATSAnalysis {
    const resumeKeywords = TextProcessor.extractKeywords(this.resumeText);
    const jobKeywords = TextProcessor.extractKeywords(this.jobDescription);
    
    const resumeSkills = TextProcessor.extractSkills(this.resumeText);
    const jobSkills = TextProcessor.extractSkills(this.jobDescription);
    
    const resumeExperience = TextProcessor.extractExperience(this.resumeText);
    const resumeEducation = TextProcessor.extractEducation(this.resumeText);
    
    // Calculate scores
    const skillsScore = this.calculateSkillsScore(resumeSkills, jobSkills);
    const experienceScore = this.calculateExperienceScore(resumeExperience, jobSkills);
    const educationScore = this.calculateEducationScore(resumeEducation, jobSkills);
    const formattingScore = this.calculateFormattingScore(this.resumeText);
    
    // Weighted overall score
    const overallScore = Math.round(
      (skillsScore * 0.40) + 
      (experienceScore * 0.30) + 
      (educationScore * 0.15) + 
      (formattingScore * 0.15)
    );

    const score: ATSScoreBreakdown = {
      skillsMatch: skillsScore,
      experienceMatch: experienceScore,
      educationMatch: educationScore,
      formattingScore: formattingScore,
      overallScore: overallScore
    };

    // Generate analysis
    const missingKeywords = this.findMissingKeywords(resumeKeywords, jobKeywords);
    const suggestions = this.generateSuggestions(score, missingKeywords);
    const strengths = this.identifyStrengths(score, resumeSkills, jobSkills);
    const formattingIssues = this.identifyFormattingIssues(this.resumeText);
    const semanticMatches = this.findSemanticMatches(this.resumeText, this.jobDescription);

    return {
      score,
      missingKeywords,
      suggestions,
      strengths,
      formattingIssues,
      semanticMatches
    };
  }

  private calculateSkillsScore(resumeSkills: string[], jobSkills: string[]): number {
    if (jobSkills.length === 0) return 100;
    
    const matchedSkills = jobSkills.filter(skill => 
      resumeSkills.some(resumeSkill => 
        resumeSkill.includes(skill) || skill.includes(resumeSkill)
      )
    );
    
    return Math.round((matchedSkills.length / jobSkills.length) * 100);
  }

  private calculateExperienceScore(experience: Array<{role: string, company: string, duration: string}>, jobSkills: string[]): number {
    if (experience.length === 0) return 0;
    
    let score = 0;
    const baseScore = Math.min(experience.length * 20, 100);
    
    // Bonus for relevant experience
    const relevantExperience = experience.filter(exp => 
      jobSkills.some(skill => 
        exp.role.toLowerCase().includes(skill) || 
        exp.company.toLowerCase().includes(skill)
      )
    );
    
    score = baseScore + (relevantExperience.length * 10);
    return Math.min(score, 100);
  }

  private calculateEducationScore(education: Array<{degree: string, institution: string, year?: string}>, jobSkills: string[]): number {
    if (education.length === 0) return 0;
    
    let score = 0;
    const baseScore = Math.min(education.length * 25, 100);
    
    // Bonus for relevant education
    const relevantEducation = education.filter(edu => 
      jobSkills.some(skill => 
        edu.degree.toLowerCase().includes(skill) || 
        edu.institution.toLowerCase().includes(skill)
      )
    );
    
    score = baseScore + (relevantEducation.length * 15);
    return Math.min(score, 100);
  }

  private calculateFormattingScore(resumeText: string): number {
    let score = 100;
    
    // Check for ATS-friendly formatting
    const hasSections = /(summary|experience|education|skills|contact)/i.test(resumeText);
    const hasBulletPoints = /[•\-\*]\s/.test(resumeText);
    const hasTables = /<table|<tr|<td/i.test(resumeText);
    const hasImages = /<img|\.jpg|\.png|\.gif/i.test(resumeText);
    const hasHeaders = /<header|<footer/i.test(resumeText);
    
    if (!hasSections) score -= 20;
    if (!hasBulletPoints) score -= 15;
    if (hasTables) score -= 25;
    if (hasImages) score -= 20;
    if (hasHeaders) score -= 15;
    
    return Math.max(score, 0);
  }

  private findMissingKeywords(resumeKeywords: string[], jobKeywords: string[]): string[] {
    const resumeSet = new Set(resumeKeywords);
    return jobKeywords.filter(keyword => !resumeSet.has(keyword));
  }

  private generateSuggestions(score: ATSScoreBreakdown, missingKeywords: string[]): string[] {
    const suggestions: string[] = [];
    
    if (score.skillsMatch < 70) {
      suggestions.push("Add more relevant skills from the job description");
    }
    
    if (score.experienceMatch < 60) {
      suggestions.push("Highlight relevant work experience that matches the job requirements");
    }
    
    if (score.educationMatch < 50) {
      suggestions.push("Include relevant education or certifications");
    }
    
    if (score.formattingScore < 80) {
      suggestions.push("Improve resume formatting for better ATS compatibility");
    }
    
    if (missingKeywords.length > 0) {
      suggestions.push(`Include these keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
    }
    
    return suggestions;
  }

  private identifyStrengths(score: ATSScoreBreakdown, resumeSkills: string[], jobSkills: string[]): string[] {
    const strengths: string[] = [];
    
    if (score.skillsMatch >= 80) {
      strengths.push("Strong skills match with job requirements");
    }
    
    if (score.experienceMatch >= 70) {
      strengths.push("Relevant work experience");
    }
    
    if (score.educationMatch >= 60) {
      strengths.push("Appropriate education background");
    }
    
    if (score.formattingScore >= 90) {
      strengths.push("ATS-friendly formatting");
    }
    
    return strengths;
  }

  private identifyFormattingIssues(resumeText: string): string[] {
    const issues: string[] = [];
    
    if (/<table|<tr|<td/i.test(resumeText)) {
      issues.push("Avoid using tables - they can confuse ATS systems");
    }
    
    if (/<img|\.jpg|\.png|\.gif/i.test(resumeText)) {
      issues.push("Remove images - ATS systems cannot read them");
    }
    
    if (/<header|<footer/i.test(resumeText)) {
      issues.push("Avoid headers and footers - they may not be read by ATS");
    }
    
    if (!/[•\-\*]\s/.test(resumeText)) {
      issues.push("Use bullet points for better readability");
    }
    
    return issues;
  }

  private findSemanticMatches(resumeText: string, jobText: string): Array<{resumeText: string, jobText: string, similarity: number}> {
    const resumeSentences = resumeText.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const jobSentences = jobText.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    const matches: Array<{resumeText: string, jobText: string, similarity: number}> = [];
    
    resumeSentences.forEach(resumeSentence => {
      jobSentences.forEach(jobSentence => {
        const similarity = TextProcessor.calculateSemanticSimilarity(resumeSentence, jobSentence);
        if (similarity > 0.3) {
          matches.push({
            resumeText: resumeSentence.trim(),
            jobText: jobSentence.trim(),
            similarity: Math.round(similarity * 100)
          });
        }
      });
    });
    
    return matches.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
  }
}
