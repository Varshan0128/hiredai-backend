import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Download } from 'lucide-react';
import { ResumeData } from '@/pages/Builder';
import { getTemplateById, renderTemplate } from '@/services/templateService';
import { downloadResume } from '@/utils/downloadUtils';
import { getLatexTemplateById } from '@/templates/latex/templates';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';

interface LiveEditorPreviewProps {
  onNext: () => void;
  onPrev: () => void;
  data: ResumeData;
  updateData: (data: Partial<ResumeData>) => void;
}

const sampleData: Partial<ResumeData> = {
  fullName: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  linkedIn: 'linkedin.com/in/alexjohnson',
  website: 'alexjohnson.dev',
  profileSummary:
    'Full-stack engineer with 5+ years of experience building scalable web apps. Passionate about performance, DX, and clean architectures.',
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
  experience: [
    {
      company: 'TechNova',
      position: 'Senior Frontend Engineer',
      startDate: '2022-01',
      endDate: 'Present',
      description:
        'Led migration to TypeScript and React Query; improved lighthouse performance by 35%; mentored 4 engineers.',
      achievements: ['Drove 20% conversion uplift', 'Cut bundle size by 45%'],
    },
  ],
  education: [
    {
      institution: 'State University',
      degree: 'B.Sc. Computer Science',
      fieldOfStudy: 'Software Engineering',
      startDate: '2015-09',
      endDate: '2019-06',
      description: 'Graduated with honors; president of Coding Club.',
    },
  ],
  certifications: [
    { name: 'AWS Certified Developer – Associate', issuer: 'Amazon', date: '2023-04' },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Realtime Analytics Dashboard',
      description: 'Built a realtime analytics platform with websockets and server-sent events.',
      technologies: ['React', 'Vite', 'Tailwind', 'Supabase'],
      link: 'https://example.com',
    },
  ],
  achievements: [
    { title: 'Hackathon Winner', description: 'Won company-wide hackathon for AI tooling.' },
  ],
};

const LiveEditorPreview: React.FC<LiveEditorPreviewProps> = ({ onNext, onPrev, data, updateData }) => {
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (prefilled) return;
    // Prefill only if mostly empty
    const hasAny = Boolean(
      data.fullName || (data.skills && data.skills.length > 0) || (data.experience && data.experience.length > 0)
    );
    if (!hasAny) {
      updateData(sampleData);
    }
    setPrefilled(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLatex = useMemo(() => data.selectedTemplate?.startsWith('latex:'), [data.selectedTemplate]);
  const latexTemplate = useMemo(() => {
    if (!isLatex) return null;
    const id = parseInt((data.selectedTemplate || '').split(':')[1] || '0');
    return getLatexTemplateById(id) || null;
  }, [isLatex, data.selectedTemplate]);

  const templateId = useMemo(() => (!isLatex ? (data.selectedTemplate ? parseInt(data.selectedTemplate) : 1) : 1), [isLatex, data.selectedTemplate]);
  const template = !isLatex ? getTemplateById(templateId) : undefined;

  const rendered = useMemo(() => {
    if (isLatex) return '';
    const content = template?.content || '';
    return renderTemplate(content, data);
  }, [isLatex, template?.content, data]);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [compiling, setCompiling] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLatex || !latexTemplate) return;

    const tex = latexTemplate.makeTex(data);
    let revoke: string | null = null;
    const controller = new AbortController();

    const run = async () => {
      try {
        setCompiling(true);
        setCompileError(null);
        const res = await fetch('https://gcioedwsnxomfjiqsitd.supabase.co/functions/v1/latex-compile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjaW9lZHdzbnhvbWZqaXFzaXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MzUyODcsImV4cCI6MjA1OTExMTI4N30.g06KG_VX7e1mJQ5re78eLAFFu8b21bkDAsybT75aJ_8'
          },
          body: JSON.stringify({ texSource: tex, engine: latexTemplate.engine }),
          signal: controller.signal,
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt);
        }
        const ab = await res.arrayBuffer();
        const blob = new Blob([ab], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        revoke = url;
        setPdfUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } catch (e: any) {
        console.error(e);
        setCompileError(e?.message || 'Failed to compile');
      } finally {
        setCompiling(false);
      }
    };

    // Debounce: compile after 1s idle
    const t = setTimeout(run, 1000);
    return () => {
      clearTimeout(t);
      controller.abort('cleanup');
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [isLatex, latexTemplate, data]);


  const addListItem = (key: keyof ResumeData, item: any) => {
    const current = (data[key] as any[]) || [];
    updateData({ [key]: [...current, item] } as any);
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    try {
      if (isLatex && latexTemplate) {
        const tex = latexTemplate.makeTex(data);
        const res = await fetch('https://gcioedwsnxomfjiqsitd.supabase.co/functions/v1/latex-compile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjaW9lZHdzbnhvbWZqaXFzaXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MzUyODcsImV4cCI6MjA1OTExMTI4N30.g06KG_VX7e1mJQ5re78eLAFFu8b21bkDAsybT75aJ_8'
          },
          body: JSON.stringify({ texSource: tex, engine: latexTemplate.engine }),
        });
        if (!res.ok) throw new Error(await res.text());
        const ab = await res.arrayBuffer();
        const blob = new Blob([ab], { type: 'application/pdf' });
        const name = (data.fullName || 'resume').replace(/\s+/g, '_');
        if (format === 'pdf') {
          saveAs(blob, `${name}.pdf`);
          return;
        }
        // Fallback: basic DOC generation for now
        await downloadResume(data, 'docx');
        return;
      }
      await downloadResume(data, format);
    } catch (e: any) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Name</Label>
              <Input id="fullName" value={data.fullName || ''} onChange={(e) => updateData({ fullName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={data.email || ''} onChange={(e) => updateData({ email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={data.phone || ''} onChange={(e) => updateData({ phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={data.location || ''} onChange={(e) => updateData({ location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedIn">LinkedIn</Label>
              <Input id="linkedIn" value={data.linkedIn || ''} onChange={(e) => updateData({ linkedIn: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={data.website || ''} onChange={(e) => updateData({ website: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Objective / Summary</Label>
            <Textarea id="summary" rows={4} value={data.profileSummary || ''} onChange={(e) => updateData({ profileSummary: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Skills (comma separated)</Label>
            <Input
              value={(data.skills || []).join(', ')}
              onChange={(e) => updateData({ skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
            />
          </div>

          <div className="space-y-2">
            <Label>Quick add</Label>
            <div className="flex flex-wrap gap-2">
              {['Leadership', 'Agile', 'CI/CD', 'GraphQL', 'Python'].map((s) => (
                <Button key={s} type="button" variant="outline" size="sm" onClick={() => addListItem('skills', s)}>
                  + {s}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onPrev} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => handleExport('docx')} className="gap-2">
                <Download className="w-4 h-4" /> DOCX
              </Button>
              <Button type="button" onClick={() => handleExport('pdf')} className="gap-2">
                <Download className="w-4 h-4" /> PDF
              </Button>
              <Button type="button" onClick={onNext} className="gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="border rounded-lg overflow-auto bg-white text-black max-h-[70vh] p-4">
            {isLatex ? (
              <div className="w-full h-[70vh]">
                {compiling && <div className="text-sm text-muted-foreground">Compiling LaTeX…</div>}
                {compileError && (
                  <div className="text-sm text-destructive">{compileError}</div>
                )}
                {pdfUrl ? (
                  <object data={pdfUrl} type="application/pdf" className="w-full h-full">
                    <p>PDF preview unavailable. <a href={pdfUrl} target="_blank" rel="noreferrer">Open PDF</a></p>
                  </object>
                ) : (
                  <div className="text-sm text-muted-foreground">No preview yet.</div>
                )}
              </div>
            ) : (
              <div
                style={{ fontFamily: template?.fontFamily }}
                dangerouslySetInnerHTML={{ __html: rendered }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveEditorPreview;
