// Utility to build LaTeX source from ResumeData
// Focused on ATS-friendly, compact, single-file TeX without external assets
import { ResumeData } from '@/pages/Builder';

export const escapeLatex = (str: string = ''): string => {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/([%#&_{}$])/g, '\\$1')
    .replace(/\^/g, '\\^{}')
    .replace(/~/g, '\\textasciitilde{}');
};

const joinNonEmpty = (arr: (string | undefined)[], sep = ' \\textbar{} '): string => {
  return arr.filter(Boolean).join(sep);
};

const section = (title: string, body: string) => `\n\\section*{${escapeLatex(title)}}\n${body}\n`;

const itemize = (items: string[]) => {
  if (!items || items.length === 0) return '';
  return ['\\begin{itemize}', ...items.map((i) => `  \\item ${escapeLatex(i)}`), '\\end{itemize}'].join('\n');
};

export interface LatexStyleOptions {
  engine?: 'pdflatex' | 'xelatex';
  geometry?: string; // e.g., margin=0.5in
  titleRule?: boolean;
  compactLists?: boolean;
  fontPackage?: 'none' | 'lmodern';
}

export const buildCompactTex = (data: ResumeData, opts: LatexStyleOptions = {}): string => {
  const geometry = opts.geometry || 'margin=0.5in';
  const useLmodern = opts.fontPackage !== 'none';

  const header = [
    escapeLatex(data.fullName || 'Your Name'),
    joinNonEmpty([
      data.email && escapeLatex(data.email),
      data.phone && escapeLatex(data.phone),
      data.location && escapeLatex(data.location),
      data.linkedIn && `LinkedIn: ${escapeLatex(data.linkedIn)}`,
      data.website && `Website: ${escapeLatex(data.website)}`,
    ]),
  ].filter(Boolean);

  const summary = data.profileSummary ? escapeLatex(data.profileSummary) : '';

  const skillsBlock = (data.skills || []).length
    ? (data.skills || []).map((s) => escapeLatex(s)).join(', ')
    : '';

  const experienceBlock = (data.experience || [])
    .map((exp) => {
      const line1 = joinNonEmpty([
        exp.position && `\\textbf{${escapeLatex(exp.position)}}`,
        exp.company && escapeLatex(exp.company),
        joinNonEmpty([exp.startDate, exp.endDate], ' -- '),
      ], ' \\hfill ');
      const desc = exp.description ? escapeLatex(exp.description) : '';
      const bullets = exp.achievements && exp.achievements.length ? itemize(exp.achievements) : '';
      return [line1, desc && `\\vspace{2pt}${desc}`, bullets].filter(Boolean).join('\n');
    })
    .join('\n\\medskip\n');

  const educationBlock = (data.education || [])
    .map((edu) => {
      const line1 = joinNonEmpty([
        edu.degree && `\\textbf{${escapeLatex(edu.degree)}}`,
        edu.fieldOfStudy && escapeLatex(edu.fieldOfStudy),
        joinNonEmpty([edu.startDate, edu.endDate], ' -- '),
      ], ' \\hfill ');
      const line2 = edu.institution ? escapeLatex(edu.institution) : '';
      const desc = edu.description ? escapeLatex(edu.description) : '';
      return [line1, line2 && `\\\\\n${line2}`, desc && `\\vspace{2pt}${desc}`].filter(Boolean).join('\n');
    })
    .join('\n\\medskip\n');

  const certsBlock = (data.certifications || [])
    .map((c) => joinNonEmpty([
      c.name && `\\textbf{${escapeLatex(c.name)}}`,
      c.issuer && escapeLatex(c.issuer),
      c.date && escapeLatex(c.date),
    ]))
    .join(' \\\n');

  const projectsBlock = (data.projects || [])
    .map((p) => {
      const header = joinNonEmpty([
        p.title && `\\textbf{${escapeLatex(p.title)}}`,
        p.technologies && p.technologies.length ? `(${escapeLatex(p.technologies.join(', '))})` : undefined,
      ]);
      const desc = p.description ? escapeLatex(p.description) : '';
      return [header, desc && `\\vspace{2pt}${desc}`].filter(Boolean).join('\n');
    })
    .join('\n\\medskip\n');

  const preamble = `\\documentclass[10pt]{article}
\\usepackage[${geometry}]{geometry}
${useLmodern ? '\\usepackage{lmodern}' : ''}
\\usepackage{enumitem}
\\setlist{nosep}
\\usepackage[hidelinks]{hyperref}
\\pagenumbering{gobble}
\\begin{document}`;

  const titleRule = opts.titleRule ? '\\noindent\\rule{\\linewidth}{0.4pt}\\vspace{-6pt}' : '';

  const doc = [
    preamble,
    `\\noindent{\\LARGE ${header[0] || ''}}\\\n${header[1] ? `\\small ${header[1]}` : ''}`,
    titleRule,
    summary ? section('Summary', summary) : '',
    skillsBlock ? section('Skills', skillsBlock) : '',
    experienceBlock ? section('Experience', experienceBlock) : '',
    educationBlock ? section('Education', educationBlock) : '',
    certsBlock ? section('Certifications', certsBlock) : '',
    projectsBlock ? section('Projects', projectsBlock) : '',
    '\\end{document}',
  ].filter(Boolean).join('\n\n');

  return doc;
};

export type MakeTexFn = (data: ResumeData) => string;

export interface LatexTemplateMeta {
  id: number;
  key: string;
  name: string;
  description: string;
  atsScore: number;
  engine: 'pdflatex' | 'xelatex';
  imageSrc?: string;
  previewSrc?: string;
  features?: string[];
  makeTex: MakeTexFn;
}
