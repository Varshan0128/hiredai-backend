
import { ResumeData } from "@/pages/Builder";
import { toast } from "sonner";
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { PortfolioFormat } from "@/types/portfolio";

/**
 * Generate clean portfolio HTML content
 */
const generatePortfolioHTML = (data: ResumeData): string => {
  const { fullName, profileSummary, experience, projects, skills, portfolioItems, selectedTemplate, templateStyles } = data;
  
  const templateName = selectedTemplate || 'Modern';
  const { primaryColor = '#1a91ff', secondaryColor = '#e1e8f0', fontFamily = 'Arial, sans-serif' } = templateStyles || {};
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${fullName || 'Portfolio'}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: ${fontFamily};
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
            line-height: 1.6;
            background-color: #fff;
          }
          
          .portfolio-header {
            text-align: center;
            margin-bottom: 40px;
            padding: 40px 20px;
            background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
            color: white;
            border-radius: 10px;
          }
          
          h1 {
            font-size: 3em;
            margin: 0 0 10px;
            font-weight: bold;
          }
          
          h2 {
            font-size: 2em;
            color: ${primaryColor};
            border-bottom: 3px solid ${secondaryColor};
            padding-bottom: 10px;
            margin: 40px 0 20px;
          }
          
          h3 {
            font-size: 1.5em;
            color: ${primaryColor};
            margin: 20px 0 10px;
          }
          
          .intro {
            text-align: center;
            max-width: 800px;
            margin: 0 auto 50px;
            font-size: 1.2em;
            color: #555;
            background: ${secondaryColor};
            padding: 30px;
            border-radius: 10px;
          }
          
          .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 30px;
            margin: 30px 0;
          }
          
          .portfolio-item {
            border: 1px solid #ddd;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
            background: white;
          }
          
          .portfolio-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          }
          
          .portfolio-content {
            padding: 25px;
          }
          
          .skills-section {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin: 30px 0;
            justify-content: center;
          }
          
          .skill-tag {
            background: ${primaryColor};
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          
          .skill-tag:hover {
            background: ${secondaryColor};
            color: ${primaryColor};
          }
          
          .experience-section {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 10px;
            margin: 30px 0;
          }
          
          .experience-item {
            margin-bottom: 30px;
            padding: 20px;
            background: white;
            border-radius: 8px;
            border-left: 4px solid ${primaryColor};
          }
          
          .job-title {
            font-size: 1.3em;
            font-weight: bold;
            color: ${primaryColor};
          }
          
          .company {
            font-size: 1.1em;
            color: #666;
            margin: 5px 0;
          }
          
          .date {
            color: #888;
            font-style: italic;
            font-size: 0.9em;
          }
          
          .tech-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 15px;
          }
          
          .tech-tag {
            background: ${secondaryColor};
            color: ${primaryColor};
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
          }
          
          @media print {
            body { margin: 0; padding: 15px; }
            .portfolio-item { break-inside: avoid; }
            @page { size: letter; margin: 0.5in; }
          }
          
          @media (max-width: 768px) {
            .portfolio-grid { grid-template-columns: 1fr; }
            h1 { font-size: 2em; }
            .portfolio-header { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="portfolio-header">
          <h1>${fullName || 'Professional Portfolio'}</h1>
          <p style="font-size: 1.2em; margin: 0;">${profileSummary || 'Welcome to my professional portfolio showcasing my projects, skills and experience.'}</p>
        </div>
        
        ${portfolioItems && portfolioItems.length > 0 ? `
          <h2>Featured Portfolio Projects</h2>
          <div class="portfolio-grid">
            ${portfolioItems.map(item => `
              <div class="portfolio-item">
                <div class="portfolio-content">
                  <h3>${item.title}</h3>
                  <p>${item.description}</p>
                  ${item.role ? `<p><strong>Role:</strong> ${item.role}</p>` : ''}
                  ${item.technologies && item.technologies.length ? `
                    <div class="tech-list">
                      ${item.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                  ` : ''}
                  ${item.link ? `<p style="margin-top: 15px;"><a href="${item.link}" target="_blank" style="color: ${primaryColor}; text-decoration: none; font-weight: bold;">→ View Project</a></p>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${projects && projects.length > 0 ? `
          <h2>Additional Projects</h2>
          <div class="portfolio-grid">
            ${projects.map(project => `
              <div class="portfolio-item">
                <div class="portfolio-content">
                  <h3>${project.title}</h3>
                  <p>${project.description}</p>
                  <div class="tech-list">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                  </div>
                  ${project.link ? `<p style="margin-top: 15px;"><a href="${project.link}" target="_blank" style="color: ${primaryColor}; text-decoration: none; font-weight: bold;">→ View Project</a></p>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${skills && skills.length > 0 ? `
          <h2>Skills & Expertise</h2>
          <div class="skills-section">
            ${skills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}
          </div>
        ` : ''}
        
        ${experience && experience.length > 0 ? `
          <h2>Professional Experience</h2>
          <div class="experience-section">
            ${experience.map(exp => `
              <div class="experience-item">
                <div class="job-title">${exp.position}</div>
                <div class="company">${exp.company}</div>
                <div class="date">${exp.startDate} - ${exp.endDate}</div>
                <p style="margin-top: 10px;">${exp.description}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <div style="text-align: center; margin-top: 50px; padding: 30px; background: ${secondaryColor}; border-radius: 10px;">
          <h3>Let's Connect!</h3>
          <p>Interested in working together? I'd love to hear from you.</p>
        </div>
      </body>
    </html>
  `;
};

/**
 * Generate portfolio text content
 */
const generatePortfolioText = (data: ResumeData): string => {
  let text = '';
  
  text += `${data.fullName || 'Portfolio'}\n`;
  text += '='.repeat((data.fullName || 'Portfolio').length) + '\n\n';
  
  if (data.profileSummary) {
    text += `${data.profileSummary}\n\n`;
  }
  
  if (data.portfolioItems && data.portfolioItems.length > 0) {
    text += 'FEATURED PORTFOLIO PROJECTS\n';
    text += '-'.repeat(28) + '\n';
    data.portfolioItems.forEach(item => {
      text += `${item.title}\n`;
      text += `${item.description}\n`;
      if (item.role) text += `Role: ${item.role}\n`;
      if (item.technologies && item.technologies.length > 0) {
        text += `Technologies: ${item.technologies.join(', ')}\n`;
      }
      if (item.link) text += `Link: ${item.link}\n`;
      text += '\n';
    });
  }
  
  if (data.projects && data.projects.length > 0) {
    text += 'ADDITIONAL PROJECTS\n';
    text += '-'.repeat(19) + '\n';
    data.projects.forEach(project => {
      text += `${project.title}\n`;
      text += `${project.description}\n`;
      text += `Technologies: ${project.technologies.join(', ')}\n`;
      if (project.link) text += `Link: ${project.link}\n`;
      text += '\n';
    });
  }
  
  if (data.skills && data.skills.length > 0) {
    text += 'SKILLS & EXPERTISE\n';
    text += '-'.repeat(17) + '\n';
    text += data.skills.join(', ') + '\n\n';
  }
  
  if (data.experience && data.experience.length > 0) {
    text += 'PROFESSIONAL EXPERIENCE\n';
    text += '-'.repeat(23) + '\n';
    data.experience.forEach(exp => {
      text += `${exp.position} at ${exp.company}\n`;
      text += `${exp.startDate} - ${exp.endDate}\n`;
      text += `${exp.description}\n\n`;
    });
  }
  
  return text;
};

/**
 * Generate portfolio content
 */
const generatePortfolioContent = async (data: ResumeData, format: PortfolioFormat): Promise<Blob> => {
  try {
    console.log(`Generating portfolio in ${format} format`);
    
    switch(format) {
      case 'pdf': {
        const htmlContent = generatePortfolioHTML(data);
        return new Blob([htmlContent], { type: 'text/html' });
      }
      
      case 'pptx': {
        const zip = new JSZip();
        
        // Create basic PowerPoint structure
        zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
          <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
          <Default Extension="xml" ContentType="application/xml"/>
          <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
        </Types>`);
        
        // Add portfolio content as HTML for reference
        const htmlContent = generatePortfolioHTML(data);
        zip.file("portfolio_content.html", htmlContent);
        
        // Add simple presentation structure
        zip.file("ppt/presentation.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
          <p:sldMasterIdLst><p:sldMasterId id="2147483648"/></p:sldMasterIdLst>
          <p:sldIdLst><p:sldId id="256"/></p:sldIdLst>
        </p:presentation>`);
        
        return await zip.generateAsync({ 
          type: "blob", 
          mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        });
      }
      
      case 'png': {
        const htmlContent = generatePortfolioHTML(data);
        return new Blob([htmlContent], { type: 'text/html' });
      }
      
      default: {
        const htmlContent = generatePortfolioHTML(data);
        return new Blob([htmlContent], { type: 'text/html' });
      }
    }
  } catch (error) {
    console.error('Error generating portfolio content:', error);
    throw error;
  }
};

/**
 * Download portfolio
 */
export const downloadPortfolio = async (data: ResumeData, format: PortfolioFormat = 'pdf'): Promise<void> => {
  try {
    console.log(`Starting portfolio download in ${format} format`);
    
    const blob = await generatePortfolioContent(data, format);
    const sanitizedName = data.fullName ? data.fullName.replace(/\s+/g, '_') : 'portfolio';
    
    let fileName;
    switch(format) {
      case 'pdf':
        fileName = `${sanitizedName}_portfolio.html`;
        break;
      case 'pptx':
        fileName = `${sanitizedName}_portfolio.pptx`;
        break;
      case 'png':
        fileName = `${sanitizedName}_portfolio.html`;
        break;
      default:
        fileName = `${sanitizedName}_portfolio.html`;
    }
    
    saveAs(blob, fileName);
    
    if (format === 'pdf') {
      toast.success('Portfolio downloaded as HTML - Open in browser and print to PDF');
    } else if (format === 'png') {
      toast.success('Portfolio downloaded as HTML - Open in browser and take a screenshot');
    } else {
      toast.success(`Portfolio downloaded as ${format.toUpperCase()}`);
    }
  } catch (error) {
    console.error('Error downloading portfolio:', error);
    toast.error('Failed to download portfolio');
    throw error;
  }
};
