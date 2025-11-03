import { ResumeData } from "@/pages/Builder";
import { toast } from "sonner";
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { getTemplateById, renderTemplate } from '@/services/templateService';

/**
 * Helper function to convert hex color to RGB
 */
const hexToRgb = (hex: string): string => {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

/**
 * Generate clean HTML content for resume
 */
const generateCleanHTML = (data: ResumeData): string => {
  const templateId = data.selectedTemplate ? parseInt(data.selectedTemplate) : 1;
  const template = getTemplateById(templateId);
  
  if (!template || !template.content) {
    throw new Error(`Template content not found for template ID: ${templateId}`);
  }
  
  const renderedContent = renderTemplate(template.content, data);
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.fullName || 'Resume'}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=${template.fontFamily.replace(/ /g, '+')}&display=swap');
          
          body {
            font-family: '${template.fontFamily}', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.6;
            background-color: #fff;
            font-size: 12pt;
            max-width: 800px;
            margin: 0 auto;
          }
          
          :root {
            --template-primary: ${template.primaryColor};
            --template-secondary: ${template.secondaryColor};
          }
          
          h1, h2, h3 { color: var(--template-primary); }
          h1 { font-size: 24pt; margin-bottom: 10px; }
          h2 { font-size: 18pt; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          h3 { font-size: 14pt; margin-bottom: 5px; }
          
          .contact-info { margin-bottom: 20px; }
          .section { margin-bottom: 25px; }
          .item { margin-bottom: 15px; }
          .job-header, .education-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .skills { display: flex; flex-wrap: wrap; gap: 8px; }
          .skill-tag { background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 10pt; }
          
          @media print {
            body { margin: 0; padding: 15px; }
            @page { size: letter; margin: 0.5in; }
          }
        </style>
      </head>
      <body>
        ${renderedContent}
      </body>
    </html>
  `;
};

/**
 * Generate simple text version of resume
 */
export const generateTextResume = (data: ResumeData): string => {
  let text = '';
  
  // Header
  text += `${data.fullName || 'Resume'}\n`;
  text += '='.repeat((data.fullName || 'Resume').length) + '\n\n';
  
  if (data.email) text += `Email: ${data.email}\n`;
  if (data.phone) text += `Phone: ${data.phone}\n`;
  if (data.location) text += `Location: ${data.location}\n`;
  if (data.linkedIn) text += `LinkedIn: ${data.linkedIn}\n`;
  if (data.website) text += `Website: ${data.website}\n`;
  text += '\n';
  
  // Profile Summary
  if (data.profileSummary) {
    text += 'PROFILE SUMMARY\n';
    text += '-'.repeat(15) + '\n';
    text += `${data.profileSummary}\n\n`;
  }
  
  // Experience
  if (data.experience && data.experience.length > 0) {
    text += 'EXPERIENCE\n';
    text += '-'.repeat(10) + '\n';
    data.experience.forEach(exp => {
      text += `${exp.position} at ${exp.company}\n`;
      text += `${exp.startDate} - ${exp.endDate}\n`;
      if (exp.description) text += `${exp.description}\n`;
      text += '\n';
    });
  }
  
  // Education
  if (data.education && data.education.length > 0) {
    text += 'EDUCATION\n';
    text += '-'.repeat(9) + '\n';
    data.education.forEach(edu => {
      text += `${edu.degree} in ${edu.fieldOfStudy || 'N/A'}\n`;
      text += `${edu.institution}\n`;
      text += `${edu.startDate} - ${edu.endDate}\n`;
      if (edu.description) text += `${edu.description}\n`;
      text += '\n';
    });
  }
  
  // Skills
  if (data.skills && data.skills.length > 0) {
    text += 'SKILLS\n';
    text += '-'.repeat(6) + '\n';
    text += data.skills.join(', ') + '\n\n';
  }
  
  // Projects
  if (data.projects && data.projects.length > 0) {
    text += 'PROJECTS\n';
    text += '-'.repeat(8) + '\n';
    data.projects.forEach(project => {
      text += `${project.title}\n`;
      text += `${project.description}\n`;
      if (project.technologies.length > 0) {
        text += `Technologies: ${project.technologies.join(', ')}\n`;
      }
      if (project.link) text += `Link: ${project.link}\n`;
      text += '\n';
    });
  }
  
  // Certifications
  if (data.certifications && data.certifications.length > 0) {
    text += 'CERTIFICATIONS\n';
    text += '-'.repeat(14) + '\n';
    data.certifications.forEach(cert => {
      text += `${cert.name}\n`;
      text += `Issued by: ${cert.issuer}\n`;
      if (cert.date) text += `Date: ${cert.date}\n`;
      text += '\n';
    });
  }
  
  return text;
};

/**
 * Generate resume content based on format
 */
const generateResumeContent = async (data: ResumeData, format: string): Promise<Blob> => {
  try {
    console.log(`Generating resume content in ${format} format`);
    
    switch(format) {
      case 'pdf': {
        // For PDF, we'll generate HTML that can be printed to PDF
        const htmlContent = generateCleanHTML(data);
        return new Blob([htmlContent], { type: 'text/html' });
      }
      
      case 'docx': {
        // For DOCX, create a simplified Word-compatible document
        const textContent = generateTextResume(data);
        const docContent = `
          <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
          <head><meta charset="utf-8"><title>Resume</title></head>
          <body><pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${textContent}</pre></body>
          </html>
        `;
        return new Blob([docContent], { 
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        });
      }
      
      case 'pptx': {
        // Create a simple PowerPoint-like presentation
        const zip = new JSZip();
        
        // Create a basic presentation structure
        const presentationXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
          <p:sldMasterIdLst><p:sldMasterId id="2147483648"/></p:sldMasterIdLst>
          <p:sldIdLst><p:sldId id="256"/></p:sldIdLst>
        </p:presentation>`;
        
        zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
          <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
          <Default Extension="xml" ContentType="application/xml"/>
          <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
        </Types>`);
        
        zip.file("ppt/presentation.xml", presentationXml);
        
        // Add slide content as HTML for now
        const htmlContent = generateCleanHTML(data);
        zip.file("resume_content.html", htmlContent);
        
        return await zip.generateAsync({ 
          type: "blob", 
          mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        });
      }
      
      case 'png':
      case 'jpg':
      case 'jpeg': {
        // For image formats, we'll create an HTML file that can be screenshot
        const htmlContent = generateCleanHTML(data);
        return new Blob([htmlContent], { type: 'text/html' });
      }
      
      case 'txt': {
        // Plain text format
        const textContent = generateTextResume(data);
        return new Blob([textContent], { type: 'text/plain' });
      }
      
      default: {
        // Default to HTML
        const htmlContent = generateCleanHTML(data);
        return new Blob([htmlContent], { type: 'text/html' });
      }
    }
  } catch (error) {
    console.error('Error generating resume content:', error);
    throw error;
  }
};

/**
 * Download resume in specified format
 */
export const downloadResume = async (data: ResumeData, format: string = 'pdf'): Promise<void> => {
  try {
    console.log(`Starting download in ${format} format`);
    
    // Generate resume content
    const blob = await generateResumeContent(data, format);
    console.log(`Generated blob of size: ${blob.size} bytes`);
    
    // Create filename
    const sanitizedName = data.fullName ? data.fullName.replace(/\s+/g, '_') : 'resume';
    let fileName;
    
    switch(format) {
      case 'pdf':
        fileName = `${sanitizedName}.html`; // HTML that can be printed to PDF
        break;
      case 'docx':
        fileName = `${sanitizedName}.doc`; // Use .doc for better compatibility
        break;
      case 'pptx':
        fileName = `${sanitizedName}.pptx`;
        break;
      case 'png':
      case 'jpg':
      case 'jpeg':
        fileName = `${sanitizedName}.html`; // HTML that can be screenshot
        break;
      case 'txt':
        fileName = `${sanitizedName}.txt`;
        break;
      default:
        fileName = `${sanitizedName}.html`;
    }
    
    console.log(`Downloading as: ${fileName}`);
    
    // Download the file
    saveAs(blob, fileName);
    
    // Show appropriate success message
    if (format === 'pdf') {
      toast.success('Resume downloaded as HTML - Open in browser and print to PDF');
    } else if (format === 'png' || format === 'jpg' || format === 'jpeg') {
      toast.success('Resume downloaded as HTML - Open in browser and take a screenshot');
    } else {
      toast.success(`Resume downloaded as ${format.toUpperCase()}`);
    }
  } catch (error) {
    console.error('Error downloading resume:', error);
    toast.error('Failed to download resume. Please try again.');
    throw error;
  }
};

/**
 * Print resume
 */
export const printResume = (data: ResumeData): void => {
  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Failed to open print window. Please check your popup blocker settings.');
      return;
    }
    
    const htmlContent = generateCleanHTML(data);
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    toast.success('Print dialog opened');
  } catch (error) {
    console.error('Error printing resume:', error);
    toast.error('Failed to print resume. Please try again.');
  }
};

/**
 * Share resume via email
 */
export const shareViaEmail = (data: ResumeData): void => {
  const subject = `Resume - ${data.fullName || 'Candidate'}`;
  const body = `Please find my resume attached. You can also view it online at: ${window.location.href}`;
  
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  toast.success('Email client opened');
};

/**
 * Copy resume link to clipboard
 * Returns void, but handles success/failure internally with toasts
 */
export const copyResumeLink = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    toast.success('Resume link copied to clipboard');
  } catch (error) {
    console.error('Error copying link:', error);
    toast.error('Failed to copy link. Please try again.');
  }
};
