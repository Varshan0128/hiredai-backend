
import { toast } from "sonner";

export interface Template {
  id: number;
  name: string;
  description: string;
  imageSrc: string;
  previewSrc: string;
  externalLink: string;
  features: string[];
  bestseller?: boolean;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  atsScore?: number;
  content?: string; // Original template content (HTML or formatted structure)
}

// 15 Original ATS-Friendly Resume Templates
export const templates: Template[] = [
  {
    id: 1,
    name: "Classic Chronological",
    description: "Traditional chronological format with clean, professional layout",
    imageSrc: "/placeholder.svg",
    previewSrc: "/placeholder.svg",
    externalLink: "",
    features: ["ATS-optimized", "Traditional layout", "Easy to scan", "Professional"],
    primaryColor: "#2563eb",
    secondaryColor: "#1d4ed8",
    fontFamily: "Georgia",
    atsScore: 95,
    content: `<div class="classic-chronological">
      <header class="resume-header">
        <h1>{{fullName}}</h1>
        <div class="contact-info">
          {{email}} | {{phone}} | {{location}}
          {{#linkedIn}}<div>{{linkedIn}}</div>{{/linkedIn}}
          {{#website}}<div>{{website}}</div>{{/website}}
        </div>
      </header>
      
      <section class="summary-section">
        <h2>Professional Summary</h2>
        <p>{{profileSummary}}</p>
      </section>
      
      <section class="experience-section">
        <h2>Professional Experience</h2>
        {{#experience}}
        <div class="experience-item">
          <div class="job-header">
            <h3>{{position}}</h3>
            <div class="company-date">
              <span class="company">{{company}}</span>
              <span class="dates">{{startDate}} - {{endDate}}</span>
            </div>
          </div>
          <p>{{description}}</p>
          {{#achievements.length}}
          <ul>
            {{#achievements}}
            <li>{{.}}</li>
            {{/achievements}}
          </ul>
          {{/achievements.length}}
        </div>
        {{/experience}}
      </section>
      
      <section class="education-section">
        <h2>Education</h2>
        {{#education}}
        <div class="education-item">
          <h3>{{degree}}{{#fieldOfStudy}} in {{fieldOfStudy}}{{/fieldOfStudy}}</h3>
          <div class="institution-date">
            <span>{{institution}}</span>
            <span>{{startDate}} - {{endDate}}</span>
          </div>
          {{#description}}<p>{{description}}</p>{{/description}}
        </div>
        {{/education}}
      </section>
      
      <section class="skills-section">
        <h2>Skills</h2>
        <div class="skills-list">
          {{#skills}}
          <span class="skill-item">{{.}}</span>
          {{/skills}}
        </div>
      </section>
      
      {{#certifications.length}}
      <section class="certifications-section">
        <h2>Certifications</h2>
        <ul>
          {{#certifications}}
          <li>{{name}} - {{issuer}} ({{date}})</li>
          {{/certifications}}
        </ul>
      </section>
      {{/certifications.length}}
      
      {{#projects.length}}
      <section class="projects-section">
        <h2>Projects</h2>
        {{#projects}}
        <div class="project-item">
          <h3>{{title}}</h3>
          {{#technologies.length}}<p class="technologies">{{technologies}}</p>{{/technologies.length}}
          <p>{{description}}</p>
        </div>
        {{/projects}}
      </section>
      {{/projects.length}}
    </div>`
  },
  {
    id: 2,
    name: "Modern Professional",
    description: "Contemporary design with clean lines and modern typography",
    imageSrc: "/placeholder.svg",
    previewSrc: "/placeholder.svg",
    externalLink: "",
    features: ["Modern design", "Clean typography", "ATS-friendly", "Professional"],
    primaryColor: "#059669",
    secondaryColor: "#047857",
    fontFamily: "Inter",
    atsScore: 96,
    content: `<div class="modern-professional">
      <header class="modern-header">
        <h1>{{fullName}}</h1>
        <div class="contact-grid">
          <span>{{email}}</span>
          <span>{{phone}}</span>
          <span>{{location}}</span>
          {{#linkedIn}}<span>{{linkedIn}}</span>{{/linkedIn}}
          {{#website}}<span>{{website}}</span>{{/website}}
        </div>
      </header>
      
      <section>
        <h2>Professional Summary</h2>
        <p>{{profileSummary}}</p>
      </section>
      
      <section>
        <h2>Core Competencies</h2>
        <div class="skills-grid">
          {{#skills}}
          <div class="skill-tag">{{.}}</div>
          {{/skills}}
        </div>
      </section>
      
      <section>
        <h2>Professional Experience</h2>
        {{#experience}}
        <div class="experience-block">
          <div class="job-title-line">
            <h3>{{position}}</h3>
            <span class="duration">{{startDate}} - {{endDate}}</span>
          </div>
          <h4>{{company}}</h4>
          <p>{{description}}</p>
          {{#achievements.length}}
          <ul class="achievements">
            {{#achievements}}
            <li>{{.}}</li>
            {{/achievements}}
          </ul>
          {{/achievements.length}}
        </div>
        {{/experience}}
      </section>
      
      <section>
        <h2>Education</h2>
        {{#education}}
        <div class="education-block">
          <div class="degree-line">
            <h3>{{degree}}{{#fieldOfStudy}} in {{fieldOfStudy}}{{/fieldOfStudy}}</h3>
            <span>{{startDate}} - {{endDate}}</span>
          </div>
          <h4>{{institution}}</h4>
          {{#description}}<p>{{description}}</p>{{/description}}
        </div>
        {{/education}}
      </section>
      
      {{#certifications.length}}
      <section>
        <h2>Professional Certifications</h2>
        <div class="certifications-grid">
          {{#certifications}}
          <div class="cert-item">
            <strong>{{name}}</strong><br>
            <span>{{issuer}}</span><br>
            <span>{{date}}</span>
          </div>
          {{/certifications}}
        </div>
      </section>
      {{/certifications.length}}
      
      {{#projects.length}}
      <section>
        <h2>Key Projects</h2>
        {{#projects}}
        <div class="project-block">
          <h3>{{title}}</h3>
          {{#technologies.length}}<p class="tech-stack">{{technologies}}</p>{{/technologies.length}}
          <p>{{description}}</p>
        </div>
        {{/projects}}
      </section>
      {{/projects.length}}
    </div>`
  },
  {
    id: 3,
    name: "Elegant Minimalist",
    description: "Refined minimalist design focusing on essential information",
    imageSrc: "/placeholder.svg",
    previewSrc: "/placeholder.svg",
    externalLink: "",
    features: ["Minimalist", "Elegant typography", "High ATS score", "Clean layout"],
    primaryColor: "#6366f1",
    secondaryColor: "#4f46e5",
    fontFamily: "Helvetica",
    atsScore: 97,
    content: `<div class="elegant-minimalist">
      <header>
        <h1>{{fullName}}</h1>
        <p class="contact-line">{{email}} • {{phone}} • {{location}}{{#linkedIn}} • {{linkedIn}}{{/linkedIn}}{{#website}} • {{website}}{{/website}}</p>
      </header>
      
      <section>
        <h2>Summary</h2>
        <p>{{profileSummary}}</p>
      </section>
      
      <section>
        <h2>Experience</h2>
        {{#experience}}
        <div class="experience-entry">
          <div class="job-line">
            <span class="position">{{position}}</span>
            <span class="separator">|</span>
            <span class="company">{{company}}</span>
            <span class="separator">|</span>
            <span class="dates">{{startDate}} - {{endDate}}</span>
          </div>
          <p>{{description}}</p>
          {{#achievements.length}}
          <ul>
            {{#achievements}}
            <li>{{.}}</li>
            {{/achievements}}
          </ul>
          {{/achievements.length}}
        </div>
        {{/experience}}
      </section>
      
      <section>
        <h2>Education</h2>
        {{#education}}
        <div class="education-entry">
          <div class="edu-line">
            <span class="degree">{{degree}}{{#fieldOfStudy}} in {{fieldOfStudy}}{{/fieldOfStudy}}</span>
            <span class="separator">|</span>
            <span class="institution">{{institution}}</span>
            <span class="separator">|</span>
            <span class="dates">{{startDate}} - {{endDate}}</span>
          </div>
          {{#description}}<p>{{description}}</p>{{/description}}
        </div>
        {{/education}}
      </section>
      
      <section>
        <h2>Skills</h2>
        <p class="skills-text">
          {{#skills}}{{.}}{{#unless @last}}, {{/unless}}{{/skills}}
        </p>
      </section>
      
      {{#certifications.length}}
      <section>
        <h2>Certifications</h2>
        {{#certifications}}
        <p>{{name}} | {{issuer}} | {{date}}</p>
        {{/certifications}}
      </section>
      {{/certifications.length}}
      
      {{#projects.length}}
      <section>
        <h2>Projects</h2>
        {{#projects}}
        <div class="project-entry">
          <h3>{{title}}</h3>
          {{#technologies.length}}<p class="tech-list">{{technologies}}</p>{{/technologies.length}}
          <p>{{description}}</p>
        </div>
        {{/projects}}
      </section>
      {{/projects.length}}
    </div>`
  },
  {
    id: 4,
    name: "Corporate Clean",
    description: "Professional corporate template with structured layout",
    imageSrc: "/placeholder.svg",
    previewSrc: "/placeholder.svg",
    externalLink: "",
    features: ["Corporate style", "Structured layout", "ATS-optimized", "Professional"],
    primaryColor: "#1f2937",
    secondaryColor: "#374151",
    fontFamily: "Arial",
    atsScore: 94,
    content: `<div class="corporate-clean">
      <header class="corporate-header">
        <h1>{{fullName}}</h1>
        <div class="contact-section">
          <div class="contact-row">
            <span>{{email}}</span>
            <span>{{phone}}</span>
            <span>{{location}}</span>
          </div>
          {{#linkedIn}}<div class="contact-row"><span>{{linkedIn}}</span></div>{{/linkedIn}}
          {{#website}}<div class="contact-row"><span>{{website}}</span></div>{{/website}}
        </div>
      </header>
      
      <section class="summary-block">
        <h2>Executive Summary</h2>
        <p>{{profileSummary}}</p>
      </section>
      
      <section class="experience-block">
        <h2>Professional Experience</h2>
        {{#experience}}
        <div class="job-entry">
          <div class="job-header-row">
            <div class="job-title-company">
              <h3>{{position}}</h3>
              <h4>{{company}}</h4>
            </div>
            <div class="job-dates">{{startDate}} - {{endDate}}</div>
          </div>
          <div class="job-details">
            <p>{{description}}</p>
            {{#achievements.length}}
            <div class="achievements-section">
              <h5>Key Achievements:</h5>
              <ul>
                {{#achievements}}
                <li>{{.}}</li>
                {{/achievements}}
              </ul>
            </div>
            {{/achievements.length}}
          </div>
        </div>
        {{/experience}}
      </section>
      
      <section class="education-block">
        <h2>Education & Training</h2>
        {{#education}}
        <div class="edu-entry">
          <div class="edu-header-row">
            <div class="degree-field">
              <h3>{{degree}}{{#fieldOfStudy}} in {{fieldOfStudy}}{{/fieldOfStudy}}</h3>
              <h4>{{institution}}</h4>
            </div>
            <div class="edu-dates">{{startDate}} - {{endDate}}</div>
          </div>
          {{#description}}<p>{{description}}</p>{{/description}}
        </div>
        {{/education}}
      </section>
      
      <section class="skills-block">
        <h2>Core Competencies</h2>
        <div class="competencies-grid">
          {{#skills}}
          <div class="competency-item">{{.}}</div>
          {{/skills}}
        </div>
      </section>
      
      {{#certifications.length}}
      <section class="certifications-block">
        <h2>Professional Certifications</h2>
        <div class="cert-list">
          {{#certifications}}
          <div class="cert-entry">
            <span class="cert-name">{{name}}</span>
            <span class="cert-issuer">{{issuer}}</span>
            <span class="cert-date">{{date}}</span>
          </div>
          {{/certifications}}
        </div>
      </section>
      {{/certifications.length}}
      
      {{#projects.length}}
      <section class="projects-block">
        <h2>Notable Projects</h2>
        {{#projects}}
        <div class="project-entry">
          <h3>{{title}}</h3>
          {{#technologies.length}}<p class="project-tech">Technologies: {{technologies}}</p>{{/technologies.length}}
          <p>{{description}}</p>
        </div>
        {{/projects}}
      </section>
      {{/projects.length}}
    </div>`
  },
  {
    id: 5,
    name: "Harvard",
    description: "Academic-inspired template with traditional scholarly formatting",
    imageSrc: "/placeholder.svg",
    previewSrc: "/placeholder.svg",
    externalLink: "",
    features: ["Academic style", "Traditional format", "Scholarly appearance", "ATS-friendly"],
    primaryColor: "#dc2626",
    secondaryColor: "#b91c1c",
    fontFamily: "Times New Roman",
    atsScore: 93,
    content: `<div class="harvard-template">
      <header class="academic-header">
        <h1>{{fullName}}</h1>
        <div class="academic-contact">
          <p>{{email}} | {{phone}} | {{location}}</p>
          {{#linkedIn}}<p>{{linkedIn}}</p>{{/linkedIn}}
          {{#website}}<p>{{website}}</p>{{/website}}
        </div>
      </header>
      
      <section class="objective-section">
        <h2>Professional Objective</h2>
        <p>{{profileSummary}}</p>
      </section>
      
      <section class="experience-section">
        <h2>Professional Experience</h2>
        {{#experience}}
        <div class="position-entry">
          <h3>{{position}}</h3>
          <p class="organization-date"><em>{{company}}</em>, {{startDate}} - {{endDate}}</p>
          <p>{{description}}</p>
          {{#achievements.length}}
          <ul class="accomplishments">
            {{#achievements}}
            <li>{{.}}</li>
            {{/achievements}}
          </ul>
          {{/achievements.length}}
        </div>
        {{/experience}}
      </section>
      
      <section class="education-section">
        <h2>Education</h2>
        {{#education}}
        <div class="degree-entry">
          <h3>{{degree}}{{#fieldOfStudy}} in {{fieldOfStudy}}{{/fieldOfStudy}}</h3>
          <p class="institution-date"><em>{{institution}}</em>, {{startDate}} - {{endDate}}</p>
          {{#description}}<p>{{description}}</p>{{/description}}
        </div>
        {{/education}}
      </section>
      
      <section class="skills-section">
        <h2>Technical Proficiencies</h2>
        <div class="skills-list">
          {{#skills}}
          <span class="skill-item">{{.}}</span>{{#unless @last}}, {{/unless}}
          {{/skills}}
        </div>
      </section>
      
      {{#certifications.length}}
      <section class="certifications-section">
        <h2>Professional Certifications</h2>
        {{#certifications}}
        <p><strong>{{name}}</strong>, {{issuer}} ({{date}})</p>
        {{/certifications}}
      </section>
      {{/certifications.length}}
      
      {{#projects.length}}
      <section class="projects-section">
        <h2>Selected Projects</h2>
        {{#projects}}
        <div class="project-entry">
          <h3>{{title}}</h3>
          {{#technologies.length}}<p class="project-technologies"><em>{{technologies}}</em></p>{{/technologies.length}}
          <p>{{description}}</p>
        </div>
        {{/projects}}
      </section>
      {{/projects.length}}
    </div>`
  },
  {
    id: 6,
    name: "Stanford",
    description: "Innovation-focused template with modern academic approach",
    imageSrc: "/placeholder.svg",
    previewSrc: "/placeholder.svg",
    externalLink: "",
    features: ["Innovation-focused", "Modern academic", "Clean design", "ATS-optimized"],
    primaryColor: "#8b0000",
    secondaryColor: "#a50000",
    fontFamily: "Source Sans Pro",
    atsScore: 95,
    content: `<div class="stanford-template">
      <header class="innovation-header">
        <h1>{{fullName}}</h1>
        <div class="contact-info-modern">
          <div class="contact-line">{{email}} • {{phone}} • {{location}}</div>
          {{#linkedIn}}<div class="contact-line">{{linkedIn}}</div>{{/linkedIn}}
          {{#website}}<div class="contact-line">{{website}}</div>{{/website}}
        </div>
      </header>
      
      <section class="profile-section">
        <h2>Professional Profile</h2>
        <p>{{profileSummary}}</p>
      </section>
      
      <section class="expertise-section">
        <h2>Areas of Expertise</h2>
        <div class="expertise-grid">
          {{#skills}}
          <div class="expertise-item">{{.}}</div>
          {{/skills}}
        </div>
      </section>
      
      <section class="experience-section">
        <h2>Professional Experience</h2>
        {{#experience}}
        <div class="role-entry">
          <div class="role-header">
            <h3>{{position}}</h3>
            <div class="org-date">{{company}} | {{startDate}} - {{endDate}}</div>
          </div>
          <p>{{description}}</p>
          {{#achievements.length}}
          <div class="impact-section">
            <h4>Key Impact:</h4>
            <ul>
              {{#achievements}}
              <li>{{.}}</li>
              {{/achievements}}
            </ul>
          </div>
          {{/achievements.length}}
        </div>
        {{/experience}}
      </section>
      
      <section class="education-section">
        <h2>Education</h2>
        {{#education}}
        <div class="academic-entry">
          <div class="degree-header">
            <h3>{{degree}}{{#fieldOfStudy}} in {{fieldOfStudy}}{{/fieldOfStudy}}</h3>
            <div class="school-date">{{institution}} | {{startDate}} - {{endDate}}</div>
          </div>
          {{#description}}<p>{{description}}</p>{{/description}}
        </div>
        {{/education}}
      </section>
      
      {{#projects.length}}
      <section class="innovation-section">
        <h2>Innovation & Projects</h2>
        {{#projects}}
        <div class="innovation-entry">
          <h3>{{title}}</h3>
          {{#technologies.length}}<p class="tech-focus">{{technologies}}</p>{{/technologies.length}}
          <p>{{description}}</p>
        </div>
        {{/projects}}
      </section>
      {{/projects.length}}
      
      {{#certifications.length}}
      <section class="credentials-section">
        <h2>Professional Credentials</h2>
        <div class="credentials-list">
          {{#certifications}}
          <div class="credential-item">
            <strong>{{name}}</strong> • {{issuer}} • {{date}}
          </div>
          {{/certifications}}
        </div>
      </section>
      {{/certifications.length}}
    </div>`
  },
  {
    id: 7,
    name: "Cambridge",
    description: "Distinguished academic template with classical British styling",
    imageSrc: "/placeholder.svg",
    previewSrc: "/placeholder.svg",
    externalLink: "",
    features: ["Classical styling", "Academic excellence", "Distinguished format", "ATS-friendly"],
    primaryColor: "#003366",
    secondaryColor: "#004080",
    fontFamily: "Garamond",
    atsScore: 94,
    content: `<div class="cambridge-template">
      <header class="distinguished-header">
        <h1>{{fullName}}</h1>
        <div class="classical-contact">
          <p>{{email}} | {{phone}} | {{location}}</p>
          {{#linkedIn}}<p>Professional Profile: {{linkedIn}}</p>{{/linkedIn}}
          {{#website}}<p>Portfolio: {{website}}</p>{{/website}}
        </div>
      </header>
      
      <section class="synopsis-section">
        <h2>Professional Synopsis</h2>
        <p>{{profileSummary}}</p>
      </section>
      
      <section class="career-section">
        <h2>Career History</h2>
        {{#experience}}
        <div class="appointment-entry">
          <h3>{{position}}</h3>
          <p class="appointment-details">{{company}} • {{startDate}} to {{endDate}}</p>
          <p>{{description}}</p>
          {{#achievements.length}}
          <div class="notable-achievements">
            <h4>Notable Achievements:</h4>
            <ul>
              {{#achievements}}
              <li>{{.}}</li>
              {{/achievements}}
            </ul>
          </div>
          {{/achievements.length}}
        </div>
        {{/experience}}
      </section>
      
      <section class="academic-section">
        <h2>Academic Qualifications</h2>
        {{#education}}
        <div class="qualification-entry">
          <h3>{{degree}}{{#fieldOfStudy}} in {{fieldOfStudy}}{{/fieldOfStudy}}</h3>
          <p class="institution-period">{{institution}} • {{startDate}} to {{endDate}}</p>
          {{#description}}<p>{{description}}</p>{{/description}}
        </div>
        {{/education}}
      </section>
      
      <section class="competencies-section">
        <h2>Professional Competencies</h2>
        <div class="competencies-list">
          {{#skills}}
          <span class="competency">{{.}}</span>{{#unless @last}} • {{/unless}}
          {{/skills}}
        </div>
      </section>
      
      {{#certifications.length}}
      <section class="qualifications-section">
        <h2>Professional Qualifications</h2>
        {{#certifications}}
        <p class="qualification-item">{{name}} ({{issuer}}, {{date}})</p>
        {{/certifications}}
      </section>
      {{/certifications.length}}
      
      {{#projects.length}}
      <section class="endeavours-section">
        <h2>Notable Endeavours</h2>
        {{#projects}}
        <div class="endeavour-entry">
          <h3>{{title}}</h3>
          {{#technologies.length}}<p class="technical-approach">{{technologies}}</p>{{/technologies.length}}
          <p>{{description}}</p>
        </div>
        {{/projects}}
      </section>
      {{/projects.length}}
    </div>`
  },
  {
    id: 8,
    name: "Oxford",
    description: "Prestigious academic template with refined traditional elements",
    imageSrc: "/placeholder.svg",
    previewSrc: "/placeholder.svg",
    externalLink: "",
    features: ["Prestigious format", "Refined design", "Traditional elements", "ATS-optimized"],
    primaryColor: "#000080",
    secondaryColor: "#191970",
    fontFamily: "Times New Roman",
    atsScore: 93,
    content: `<div class="oxford-template">
      <header class="prestigious-header">
        <h1>{{fullName}}</h1>
        <div class="refined-contact">
          <div class="contact-details">
            <span>{{email}}</span> | <span>{{phone}}</span> | <span>{{location}}</span>
          </div>
          {{#linkedIn}}<div class="professional-links">{{linkedIn}}</div>{{/linkedIn}}
          {{#website}}<div class="professional-links">{{website}}</div>{{/website}}
        </div>
      </header>
      
      <section class="summary-section">
        <h2>Professional Summary</h2>
        <p class="summary-text">{{profileSummary}}</p>
      </section>
      
      <section class="appointments-section">
        <h2>Professional Appointments</h2>
        {{#experience}}
        <div class="appointment">
          <div class="appointment-header">
            <h3>{{position}}</h3>
            <p class="organization">{{company}}</p>
            <p class="tenure">{{startDate}} – {{endDate}}</p>
          </div>
          <p class="appointment-description">{{description}}</p>
          {{#achievements.length}}
          <div class="key-contributions">
            <h4>Key Contributions:</h4>
            <ul>
              {{#achievements}}
              <li>{{.}}</li>
              {{/achievements}}
            </ul>
          </div>
          {{/achievements.length}}
        </div>
        {{/experience}}
      </section>
      
      <section class="education-section">
        <h2>Educational Background</h2>
        {{#education}}
        <div class="academic-qualification">
          <h3>{{degree}}{{#fieldOfStudy}} in {{fieldOfStudy}}{{/fieldOfStudy}}</h3>
          <p class="alma-mater">{{institution}}</p>
          <p class="academic-period">{{startDate}} – {{endDate}}</p>
          {{#description}}<p class="academic-note">{{description}}</p>{{/description}}
        </div>
        {{/education}}
      </section>
      
      <section class="expertise-section">
        <h2>Areas of Expertise</h2>
        <div class="expertise-listing">
          {{#skills}}
          <span class="expertise-area">{{.}}</span>{{#unless @last}}, {{/unless}}
          {{/skills}}
        </div>
      </section>
      
      {{#certifications.length}}
      <section class="credentials-section">
        <h2>Professional Credentials</h2>
        <div class="credentials-listing">
          {{#certifications}}
          <p class="credential">{{name}} • {{issuer}} • {{date}}</p>
          {{/certifications}}
        </div>
      </section>
      {{/certifications.length}}
      
      {{#projects.length}}
      <section class="research-section">
        <h2>Notable Projects & Research</h2>
        {{#projects}}
        <div class="research-item">
          <h3>{{title}}</h3>
          {{#technologies.length}}<p class="methodology">{{technologies}}</p>{{/technologies.length}}
          <p>{{description}}</p>
        </div>
        {{/projects}}
      </section>
      {{/projects.length}}
    </div>`
  },
  {
    id: 9,
    name: "New York",
    description: "Dynamic metropolitan template with bold, professional styling",
    imageSrc: "/placeholder.svg",
    previewSrc: "/placeholder.svg",
    externalLink: "",
    features: ["Metropolitan style", "Bold design", "Dynamic layout", "ATS-friendly"],
    primaryColor: "#ff6b35",
    secondaryColor: "#e55039",
    fontFamily: "Helvetica",
    atsScore: 96,
    content: `<div class="new-york-template">
      <header class="metro-header">
        <h1>{{fullName}}</h1>
        <div class="dynamic-contact">
          <div class="contact-primary">{{email}} | {{phone}} | {{location}}</div>
          <div class="contact-secondary">
            {{#linkedIn}}<span>{{linkedIn}}</span>{{/linkedIn}}
            {{#website}}{{#linkedIn}} | {{/linkedIn}}<span>{{website}}</span>{{/website}}
          </div>
        </div>
      </header>
      
      <section class="profile-section">
        <h2>Professional Profile</h2>
        <p>{{profileSummary}}</p>
      </section>
      
      <section class="skills-section">
        <h2>Core Skills</h2>
        <div class="skills-metro">
          {{#skills}}
          <div class="skill-badge">{{.}}</div>
          {{/skills}}
        </div>
      </section>
      
      <section class="experience-section">
        <h2>Professional Experience</h2>
        {{#experience}}
        <div class="job-block">
          <div class="job-header-metro">
            <div class="job-title-section">
              <h3>{{position}}</h3>
              <h4>{{company}}</h4>
            </div>
            <div class="job-period">{{startDate}} - {{endDate}}</div>
          </div>
          <p class="job-summary">{{description}}</p>
          {{#achievements.length}}
          <div class="achievements-metro">
            <h5>Key Achievements:</h5>
            <ul>
              {{#achievements}}
              <li>{{.}}</li>
              {{/achievements}}
            </ul>
          </div>
          {{/achievements.length}}
        </div>
        {{/experience}}
      </section>
      
      <section class="education-section">
        <h2>Education</h2>
        {{#education}}
        <div class="edu-block">
          <div class="edu-header-metro">
            <div class="degree-section">
              <h3>{{degree}}{{#fieldOfStudy}} in {{fieldOfStudy}}{{/fieldOfStudy}}</h3>
              <h4>{{institution}}</h4>
            </div>
            <div class="edu-period">{{startDate}} - {{endDate}}</div>
          </div>
          {{#description}}<p>{{description}}</p>{{/description}}
        </div>
        {{/education}}
      </section>
      
      {{#projects.length}}
      <section class="projects-section">
        <h2>Featured Projects</h2>
        {{#projects}}
        <div class="project-block">
          <h3>{{title}}</h3>
          {{#technologies.length}}<p class="tech-stack-metro">{{technologies}}</p>{{/technologies.length}}
          <p>{{description}}</p>
        </div>
        {{/projects}}
      </section>
      {{/projects.length}}
      
      {{#certifications.length}}
      <section class="certifications-section">
        <h2>Certifications</h2>
        <div class="cert-grid-metro">
          {{#certifications}}
          <div class="cert-card">
            <div class="cert-name">{{name}}</div>
            <div class="cert-issuer">{{issuer}}</div>
            <div class="cert-date">{{date}}</div>
          </div>
          {{/certifications}}
        </div>
      </section>
      {{/certifications.length}}
    </div>`
  },
  {
    id: 10,
    name: "Chicago Professional",
    description: "Midwest professional template with structured, no-nonsense approach",
    imageSrc: "/placeholder.svg",
    previewSrc: "/placeholder.svg",
    externalLink: "",
    features: ["Structured approach", "Professional format", "No-nonsense design", "ATS-optimized"],
    primaryColor: "#1e40af",
    secondaryColor: "#1d4ed8",
    fontFamily: "Arial",
    atsScore: 95,
    content: `<div class="chicago-professional">
      <header class="structured-header">
        <h1>{{fullName}}</h1>
        <div class="contact-structured">
          <div class="primary-contact">{{email}} • {{phone}} • {{location}}</div>
          {{#linkedIn}}<div class="secondary-contact">{{linkedIn}}</div>{{/linkedIn}}
          {{#website}}<div class="secondary-contact">{{website}}</div>{{/website}}
        </div>
      </header>
      
      <section class="objective-section">
        <h2>Professional Objective</h2>
        <p>{{profileSummary}}</p>
      </section>
      
      <section class="qualifications-section">
        <h2>Core Qualifications</h2>
        <div class="qualifications-grid">
          {{#skills}}
          <div class="qualification-item">{{.}}</div>
          {{/skills}}
        </div>
      </section>
      
      <section class="employment-section">
        <h2>Employment History</h2>
        {{#experience}}
        <div class="employment-record">
          <div class="position-header">
            <div class="position-info">
              <h3>{{position}}</h3>
              <h4>{{company}}</h4>
            </div>
            <div class="employment-dates">{{startDate}} to {{endDate}}</div>
          </div>
          <div class="position-details">
            <p>{{description}}</p>
            {{#achievements.length}}
            <div class="accomplishments">
              <h5>Key Accomplishments:</h5>
              <ul>
                {{#achievements}}
                <li>{{.}}</li>
                {{/achievements}}
              </ul>
            </div>
            {{/achievements.length}}
          </div>
        </div>
        {{/experience}}
      </section>
      
      <section class="education-section">
        <h2>Educational Background</h2>
        {{#education}}
        <div class="education-record">
          <div class="degree-header">
            <div class="degree-info">
              <h3>{{degree}}{{#fieldOfStudy}} in {{fieldOfStudy}}{{/fieldOfStudy}}</h3>
              <h4>{{institution}}</h4>
            </div>
            <div class="graduation-dates">{{startDate}} to {{endDate}}</div>
          </div>
          {{#description}}<p>{{description}}</p>{{/description}}
        </div>
        {{/education}}
      </section>
      
      {{#certifications.length}}
      <section class="credentials-section">
        <h2>Professional Credentials</h2>
        <div class="credentials-structured">
          {{#certifications}}
          <div class="credential-entry">
            <span class="credential-name">{{name}}</span>
            <span class="credential-issuer">{{issuer}}</span>
            <span class="credential-date">{{date}}</span>
          </div>
          {{/certifications}}
        </div>
      </section>
      {{/certifications.length}}
      
      {{#projects.length}}
      <section class="projects-section">
        <h2>Notable Projects</h2>
        {{#projects}}
        <div class="project-record">
          <h3>{{title}}</h3>
          {{#technologies.length}}<p class="project-technologies">{{technologies}}</p>{{/technologies.length}}
          <p>{{description}}</p>
        </div>
        {{/projects}}
      </section>
      {{/projects.length}}
    </div>`
  },
  {
    id: 11,
    name: "Berlin Creative",
    description: "Contemporary European template with creative flair and modern design",
    imageSrc: "/placeholder.svg",
    previewSrc: "/placeholder.svg",
    externalLink: "",
    features: ["Creative flair", "Contemporary design", "European styling", "ATS-friendly"],
    primaryColor: "#9333ea",
    secondaryColor: "#7c3aed",
    fontFamily: "Source Sans Pro",
    atsScore: 92,
    content: `<div class="berlin-creative">
      <header class="creative-header">
        <h1>{{fullName}}</h1>
        <div class="contact-creative">
          <div class="contact-flow">
            <span>{{email}}</span>
            <span class="divider">×</span>
            <span>{{phone}}</span>
            <span class="divider">×</span>
            <span>{{location}}</span>
          </div>
          <div class="digital-presence">
            {{#linkedIn}}<span>{{linkedIn}}</span>{{/linkedIn}}
            {{#website}}{{#linkedIn}} × {{/linkedIn}}<span>{{website}}</span>{{/website}}
          </div>
        </div>
      </header>
      
      <section class="vision-section">
        <h2>Professional Vision</h2>
        <p>{{profileSummary}}</p>
      </section>
      
      <section class="capabilities-section">
        <h2>Capabilities</h2>
        <div class="capabilities-flow">
          {{#skills}}
          <span class="capability-tag">{{.}}</span>
          {{/skills}}
        </div>
      </section>
      
      <section class="journey-section">
        <h2>Professional Journey</h2>
        {{#experience}}
        <div class="journey-milestone">
          <div class="milestone-header">
            <div class="role-creative">
              <h3>{{position}}</h3>
              <div class="company-creative">{{company}}</div>
            </div>
            <div class="timeline">{{startDate}} – {{endDate}}</div>
          </div>
          <p class="milestone-story">{{description}}</p>
          {{#achievements.length}}
          <div class="impact-highlights">
            <h4>Impact Highlights:</h4>
            <ul>
              {{#achievements}}
              <li>{{.}}</li>
              {{/achievements}}
            </ul>
          </div>
          {{/achievements.length}}
        </div>
        {{/experience}}
      </section>
      
      <section class="learning-section">
        <h2>Learning & Development</h2>
        {{#education}}
        <div class="learning-milestone">
          <div class="learning-header">
            <div class="degree-creative">
              <h3>{{degree}}{{#fieldOfStudy}} in {{fieldOfStudy}}{{/fieldOfStudy}}</h3>
              <div class="institution-creative">{{institution}}</div>
            </div>
            <div class="study-period">{{startDate}} – {{endDate}}</div>
          </div>
          {{#description}}<p>{{description}}</p>{{/description}}
        </div>
        {{/education}}
      </section>
      
      {{#projects.length}}
      <section class="creations-section">
        <h2>Notable Creations</h2>
        {{#projects}}
        <div class="creation-showcase">
          <h3>{{title}}</h3>
          {{#technologies.length}}<div class="creation-tools">{{technologies}}</div>{{/technologies.length}}
          <p>{{description}}</p>
        </div>
        {{/projects}}
      </section>
      {{/projects.length}}
      
      {{#certifications.length}}
      <section class="recognition-section">
        <h2>Recognition & Certifications</h2>
        <div class="recognition-flow">
          {{#certifications}}
          <div class="recognition-item">
            <div class="recognition-title">{{name}}</div>
            <div class="recognition-source">{{issuer}}</div>
            <div class="recognition-time">{{date}}</div>
          </div>
          {{/certifications}}
        </div>
      </section>
      {{/certifications.length}}
    </div>`
  },
  {
    id: 12,
    name: "London Corporate",
    description: "British corporate template with refined professionalism and traditional elegance",
    imageSrc: "/placeholder.svg",
    previewSrc: "/placeholder.svg",
    externalLink: "",
    features: ["British corporate", "Refined professionalism", "Traditional elegance", "ATS-optimized"],
    primaryColor: "#16a085",
    secondaryColor: "#138d75",
    fontFamily: "Times New Roman",
    atsScore: 94,
    content: `<div class="london-corporate">
      <header class="corporate-british-header">
        <h1>{{fullName}}</h1>
        <div class="contact-refined">
          <div class="contact-primary-line">{{email}} | {{phone}} | {{location}}</div>
          {{#linkedIn}}<div class="contact-professional">{{linkedIn}}</div>{{/linkedIn}}
          {{#website}}<div class="contact-professional">{{website}}</div>{{/website}}
        </div>
      </header>
      
      <section class="executive-summary">
        <h2>Executive Summary</h2>
        <p>{{profileSummary}}</p>
      </section>
      
      <section class="core-competencies">
        <h2>Core Competencies</h2>
        <div class="competencies-corporate">
          {{#skills}}
          <div class="competency-british">{{.}}</div>
          {{/skills}}
        </div>
      </section>
      
      <section class="career-progression">
        <h2>Career Progression</h2>
        {{#experience}}
        <div class="position-corporate">
          <div class="position-header-british">
            <div class="title-organisation">
              <h3>{{position}}</h3>
              <h4>{{company}}</h4>
            </div>
            <div class="tenure-period">{{startDate}} to {{endDate}}</div>
          </div>
          <div class="position-narrative">
            <p>{{description}}</p>
            {{#achievements.length}}
            <div class="key-deliverables">
              <h5>Key Deliverables:</h5>
              <ul>
                {{#achievements}}
                <li>{{.}}</li>
                {{/achievements}}
              </ul>
            </div>
            {{/achievements.length}}
          </div>
        </div>
        {{/experience}}
      </section>
      
      <section class="academic-credentials">
        <h2>Academic Credentials</h2>
        {{#education}}
        <div class="academic-record">
          <div class="qualification-header">
            <div class="degree-discipline">
              <h3>{{degree}}{{#fieldOfStudy}} in {{fieldOfStudy}}{{/fieldOfStudy}}</h3>
              <h4>{{institution}}</h4>
            </div>
            <div class="academic-period">{{startDate}} to {{endDate}}</div>
          </div>
          {{#description}}<p>{{description}}</p>{{/description}}
        </div>
        {{/education}}
      </section>
      
      {{#certifications.length}}
      <section class="professional-memberships">
        <h2>Professional Memberships & Certifications</h2>
        <div class="memberships-list">
          {{#certifications}}
          <div class="membership-entry">
            <span class="membership-title">{{name}}</span>
            <span class="membership-body">{{issuer}}</span>
            <span class="membership-date">{{date}}</span>
          </div>
          {{/certifications}}
        </div>
      </section>
      {{/certifications.length}}
      
      {{#projects.length}}
      <section class="strategic-initiatives">
        <h2>Strategic Initiatives & Projects</h2>
        {{#projects}}
        <div class="initiative-record">
          <h3>{{title}}</h3>
          {{#technologies.length}}<p class="initiative-approach">{{technologies}}</p>{{/technologies.length}}
          <p>{{description}}</p>
        </div>
        {{/projects}}
      </section>
      {{/projects.length}}
    </div>`
  },
  {
    id: 13,
    name: "Paris Minimal",
    description: "French-inspired minimalist template with sophisticated simplicity",
    imageSrc: "/placeholder.svg",
    previewSrc: "/placeholder.svg",
    externalLink: "",
    features: ["French-inspired", "Minimalist design", "Sophisticated simplicity", "ATS-friendly"],
    primaryColor: "#2d3748",
    secondaryColor: "#4a5568",
    fontFamily: "Helvetica",
    atsScore: 97,
    content: `<div class="paris-minimal">
      <header class="minimal-elegant">
        <h1>{{fullName}}</h1>
        <div class="contact-minimal">
          <p>{{email}} · {{phone}} · {{location}}</p>
          {{#linkedIn}}<p>{{linkedIn}}</p>{{/linkedIn}}
          {{#website}}<p>{{website}}</p>{{/website}}
        </div>
      </header>
      
      <section class="essence-section">
        <h2>Essence</h2>
        <p>{{profileSummary}}</p>
      </section>
      
      <section class="savoir-faire">
        <h2>Savoir-faire</h2>
        <div class="skills-minimal">
          {{#skills}}
          <span class="skill-french">{{.}}</span>{{#unless @last}} · {{/unless}}
          {{/skills}}
        </div>
      </section>
      
      <section class="parcours">
        <h2>Parcours Professionnel</h2>
        {{#experience}}
        <div class="experience-minimal">
          <div class="role-minimal">
            <h3>{{position}}</h3>
            <div class="company-period">{{company}} · {{startDate}}–{{endDate}}</div>
          </div>
          <p>{{description}}</p>
          {{#achievements.length}}
          <div class="realisations">
            <ul>
              {{#achievements}}
              <li>{{.}}</li>
              {{/achievements}}
            </ul>
          </div>
          {{/achievements.length}}
        </div>
        {{/experience}}
      </section>
      
      <section class="formation">
        <h2>Formation</h2>
        {{#education}}
        <div class="education-minimal">
          <div class="degree-minimal">
            <h3>{{degree}}{{#fieldOfStudy}} en {{fieldOfStudy}}{{/fieldOfStudy}}</h3>
            <div class="institution-period">{{institution}} · {{startDate}}–{{endDate}}</div>
          </div>
          {{#description}}<p>{{description}}</p>{{/description}}
        </div>
        {{/education}}
      </section>
      
      {{#projects.length}}
      <section class="projets">
        <h2>Projets Notables</h2>
        {{#projects}}
        <div class="project-minimal">
          <h3>{{title}}</h3>
          {{#technologies.length}}<div class="technologies-minimal">{{technologies}}</div>{{/technologies.length}}
          <p>{{description}}</p>
        </div>
        {{/projects}}
      </section>
      {{/projects.length}}
      
      {{#certifications.length}}
      <section class="certifications-minimal">
        <h2>Certifications</h2>
        {{#certifications}}
        <div class="cert-minimal">{{name}} · {{issuer}} · {{date}}</div>
        {{/certifications}}
      </section>
      {{/certifications.length}}
    </div>`
  },
  {
    id: 14,
    name: "Toronto Clean",
    description: "Canadian professional template with clean, approachable design",
    imageSrc: "/placeholder.svg",
    previewSrc: "/placeholder.svg",
    externalLink: "",
    features: ["Canadian professional", "Clean design", "Approachable format", "ATS-optimized"],
    primaryColor: "#dc2626",
    secondaryColor: "#b91c1c",
    fontFamily: "Open Sans",
    atsScore: 95,
    content: `<div class="toronto-clean">
      <header class="clean-canadian">
        <h1>{{fullName}}</h1>
        <div class="contact-clean">
          <div class="contact-line">{{email}} | {{phone}} | {{location}}</div>
          {{#linkedIn}}<div class="contact-line">{{linkedIn}}</div>{{/linkedIn}}
          {{#website}}<div class="contact-line">{{website}}</div>{{/website}}
        </div>
      </header>
      
      <section class="profile-clean">
        <h2>Professional Profile</h2>
        <p>{{profileSummary}}</p>
      </section>
      
      <section class="skills-clean">
        <h2>Key Skills</h2>
        <div class="skills-canadian">
          {{#skills}}
          <div class="skill-clean">{{.}}</div>
          {{/skills}}
        </div>
      </section>
      
      <section class="experience-clean">
        <h2>Work Experience</h2>
        {{#experience}}
        <div class="job-clean">
          <div class="job-header-clean">
            <div class="position-company-clean">
              <h3>{{position}}</h3>
              <h4>{{company}}</h4>
            </div>
            <div class="dates-clean">{{startDate}} - {{endDate}}</div>
          </div>
          <p>{{description}}</p>
          {{#achievements.length}}
          <div class="achievements-clean">
            <h5>Key Achievements:</h5>
            <ul>
              {{#achievements}}
              <li>{{.}}</li>
              {{/achievements}}
            </ul>
          </div>
          {{/achievements.length}}
        </div>
        {{/experience}}
      </section>
      
      <section class="education-clean">
        <h2>Education</h2>
        {{#education}}
        <div class="edu-clean">
          <div class="edu-header-clean">
            <div class="degree-institution-clean">
              <h3>{{degree}}{{#fieldOfStudy}} in {{fieldOfStudy}}{{/fieldOfStudy}}</h3>
              <h4>{{institution}}</h4>
            </div>
            <div class="edu-dates-clean">{{startDate}} - {{endDate}}</div>
          </div>
          {{#description}}<p>{{description}}</p>{{/description}}
        </div>
        {{/education}}
      </section>
      
      {{#certifications.length}}
      <section class="certifications-clean">
        <h2>Certifications</h2>
        <div class="cert-list-clean">
          {{#certifications}}
          <div class="cert-clean">
            <span class="cert-name-clean">{{name}}</span>
            <span class="cert-issuer-clean">{{issuer}}</span>
            <span class="cert-date-clean">{{date}}</span>
          </div>
          {{/certifications}}
        </div>
      </section>
      {{/certifications.length}}
      
      {{#projects.length}}
      <section class="projects-clean">
        <h2>Notable Projects</h2>
        {{#projects}}
        <div class="project-clean">
          <h3>{{title}}</h3>
          {{#technologies.length}}<p class="tech-clean">{{technologies}}</p>{{/technologies.length}}
          <p>{{description}}</p>
        </div>
        {{/projects}}
      </section>
      {{/projects.length}}
    </div>`
  },
  {
    id: 15,
    name: "Sydney Modern",
    description: "Australian contemporary template with fresh, modern approach",
    imageSrc: "/placeholder.svg",
    previewSrc: "/placeholder.svg",
    externalLink: "",
    features: ["Contemporary design", "Fresh approach", "Modern layout", "ATS-friendly"],
    primaryColor: "#0284c7",
    secondaryColor: "#0369a1",
    fontFamily: "Source Sans Pro",
    atsScore: 96,
    content: `<div class="sydney-modern">
      <header class="modern-australian">
        <h1>{{fullName}}</h1>
        <div class="contact-modern">
          <div class="contact-primary-modern">{{email}} • {{phone}} • {{location}}</div>
          <div class="contact-digital">
            {{#linkedIn}}<span>{{linkedIn}}</span>{{/linkedIn}}
            {{#website}}{{#linkedIn}} • {{/linkedIn}}<span>{{website}}</span>{{/website}}
          </div>
        </div>
      </header>
      
      <section class="summary-modern">
        <h2>Professional Summary</h2>
        <p>{{profileSummary}}</p>
      </section>
      
      <section class="expertise-modern">
        <h2>Technical Expertise</h2>
        <div class="expertise-tags">
          {{#skills}}
          <span class="expertise-tag">{{.}}</span>
          {{/skills}}
        </div>
      </section>
      
      <section class="experience-modern">
        <h2>Professional Experience</h2>
        {{#experience}}
        <div class="role-modern">
          <div class="role-header-modern">
            <div class="title-company-modern">
              <h3>{{position}}</h3>
              <div class="company-modern">{{company}}</div>
            </div>
            <div class="period-modern">{{startDate}} – {{endDate}}</div>
          </div>
          <p class="role-description">{{description}}</p>
          {{#achievements.length}}
          <div class="highlights-modern">
            <h5>Key Highlights:</h5>
            <ul>
              {{#achievements}}
              <li>{{.}}</li>
              {{/achievements}}
            </ul>
          </div>
          {{/achievements.length}}
        </div>
        {{/experience}}
      </section>
      
      <section class="education-modern">
        <h2>Education & Qualifications</h2>
        {{#education}}
        <div class="qualification-modern">
          <div class="qualification-header">
            <div class="degree-field-modern">
              <h3>{{degree}}{{#fieldOfStudy}} in {{fieldOfStudy}}{{/fieldOfStudy}}</h3>
              <div class="institution-modern">{{institution}}</div>
            </div>
            <div class="study-period-modern">{{startDate}} – {{endDate}}</div>
          </div>
          {{#description}}<p>{{description}}</p>{{/description}}
        </div>
        {{/education}}
      </section>
      
      {{#projects.length}}
      <section class="projects-modern">
        <h2>Featured Projects</h2>
        {{#projects}}
        <div class="project-modern">
          <h3>{{title}}</h3>
          {{#technologies.length}}<div class="project-tech-modern">{{technologies}}</div>{{/technologies.length}}
          <p>{{description}}</p>
        </div>
        {{/projects}}
      </section>
      {{/projects.length}}
      
      {{#certifications.length}}
      <section class="certifications-modern">
        <h2>Professional Certifications</h2>
        <div class="certs-modern">
          {{#certifications}}
          <div class="cert-modern">
            <div class="cert-title-modern">{{name}}</div>
            <div class="cert-provider-modern">{{issuer}}</div>
            <div class="cert-year-modern">{{date}}</div>
          </div>
          {{/certifications}}
        </div>
      </section>
      {{/certifications.length}}
    </div>`
  }
];

// Get a specific template by ID
export const getTemplateById = (id: number): Template | undefined => {
  return templates.find(template => template.id === id);
};

// Substitute template placeholders with actual resume data
export const renderTemplate = (templateContent: string, data: any): string => {
  // This is a simplified template renderer
  // In a real application, you'd use a proper template engine like Handlebars or Mustache
  
  try {
    let renderedContent = templateContent;
    
    // Replace simple placeholders
    const simpleFields = ['fullName', 'email', 'phone', 'location', 'linkedIn', 'website', 'profileSummary'];
    simpleFields.forEach(field => {
      if (data[field]) {
        const regex = new RegExp(`{{${field}}}`, 'g');
        renderedContent = renderedContent.replace(regex, data[field]);
      } else {
        const regex = new RegExp(`{{${field}}}`, 'g');
        renderedContent = renderedContent.replace(regex, '');
      }
    });
    
    // Handle conditional sections with # prefix
    const conditionalRegex = /{{#(\w+)(\.length)?}}([\s\S]*?){{\/\1(\.length)?}}/g;
    renderedContent = renderedContent.replace(conditionalRegex, (match, key, isLength, content) => {
      const value = key.includes('.') 
        ? key.split('.').reduce((obj, k) => obj && obj[k], data)
        : data[key];
        
      if (isLength && Array.isArray(value)) {
        return value.length > 0 ? content : '';
      }
      
      return value ? content : '';
    });
    
    // Handle arrays with # prefix for iteration
    const arrayProperties = ['skills', 'experience', 'education', 'certifications', 'projects', 'achievements'];
    arrayProperties.forEach(arrayProp => {
      if (Array.isArray(data[arrayProp]) && data[arrayProp].length > 0) {
        // Find all instances of this array in the template
        const arrayRegex = new RegExp(`{{#${arrayProp}}}([\\s\\S]*?){{\\/${arrayProp}}}`, 'g');
        renderedContent = renderedContent.replace(arrayRegex, (match, itemTemplate) => {
          return data[arrayProp].map((item: any) => {
            let renderedItem = itemTemplate;
            
            // Replace properties of this item
            Object.keys(item).forEach(prop => {
              const propRegex = new RegExp(`{{${prop}}}`, 'g');
              renderedItem = renderedItem.replace(propRegex, item[prop] || '');
            });
            
            // Handle array properties within items
            Object.keys(item).forEach(prop => {
              if (Array.isArray(item[prop])) {
                const arrayItemRegex = new RegExp(`{{#${prop}}}([\\s\\S]*?){{\\/${prop}}}`, 'g');
                renderedItem = renderedItem.replace(arrayItemRegex, (match, content) => {
                  return item[prop].map((subitem: any) => {
                    return content.replace(/{{\.}}/g, subitem);
                  }).join('');
                });
              }
            });
            
            return renderedItem;
          }).join('');
        });
      }
    });
    
    // Final pass to remove any remaining unreplaced placeholders
    renderedContent = renderedContent.replace(/{{[^{}]+}}/g, '');
    
    return renderedContent;
  } catch (error) {
    console.error('Error rendering template:', error);
    toast.error('Error rendering resume template');
    return '<div class="error">Error rendering template</div>';
  }
};

// Apply template CSS styles based on template selection
export const applyTemplateStyles = (templateId: number) => {
  const template = getTemplateById(templateId);
  
  if (template) {
    document.documentElement.style.setProperty('--template-primary', template.primaryColor);
    document.documentElement.style.setProperty('--template-secondary', template.secondaryColor);
    
    // Add any additional styling as needed
    return {
      primaryColor: template.primaryColor,
      secondaryColor: template.secondaryColor,
      fontFamily: template.fontFamily
    };
  }
  
  return null;
};
