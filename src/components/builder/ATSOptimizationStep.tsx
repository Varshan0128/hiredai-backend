import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Mic, Volume2 } from 'lucide-react';
import { ResumeData } from '@/pages/Builder';
import { useNavigate } from 'react-router-dom';

interface ATSOptimizationStepProps {
  onNext: () => void;
  onPrev: () => void;
  data: ResumeData;
  updateData: (data: Partial<ResumeData>) => void;
}

const extractKeywords = (text: string): string[] => {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3)
    )
  ).slice(0, 30);
};

const baseScore = (data: ResumeData) => {
  let score = 50;
  if (data.selectedTemplate) score += 10;
  if ((data.skills || []).length > 5) score += 10;
  if ((data.experience || []).length > 0) score += 10;
  if ((data.education || []).length > 0) score += 10;
  return Math.min(95, score);
};

const ATSOptimizationStep: React.FC<ATSOptimizationStepProps> = ({ onNext, onPrev, data, updateData }) => {
  const navigate = useNavigate();
  const [jobText, setJobText] = useState('Senior React developer with TypeScript, GraphQL, AWS, CI/CD, Agile.');
  const [addedCount, setAddedCount] = useState(0);
  const [newCert, setNewCert] = useState('');

  const currentScore = useMemo(() => baseScore(data) + addedCount, [data, addedCount]);
  const keywords = useMemo(() => extractKeywords(jobText), [jobText]);

  const existingSkills = new Set((data.skills || []).map((s) => s.toLowerCase()));
  const suggestions = keywords.filter((k) => !existingSkills.has(k));

  const addKeyword = (k: string) => {
    const next = [...(data.skills || []), k];
    updateData({ skills: next });
    setAddedCount((c) => Math.min(50, c + 1));
  };

  const speakPrompt = () => {
    const utter = new SpeechSynthesisUtterance(
      'Do you have any certifications from events, courses, or achievements that could strengthen your resume?'
    );
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const addCertification = () => {
    const trimmed = newCert.trim();
    if (!trimmed) return;
    const certs = [...(data.certifications || []), { name: trimmed, issuer: 'Self-Reported', date: '' }];
    updateData({ certifications: certs });
    // Small score boost if related to job keywords
    if (keywords.some((k) => trimmed.toLowerCase().includes(k))) setAddedCount((c) => Math.min(50, c + 1));
    setNewCert('');
  };

  const addCourseToLearningPath = (title: string) => {
    const storeKey = 'learning_path_courses';
    const existing = JSON.parse(localStorage.getItem(storeKey) || '[]');
    const updated = Array.from(new Set([title, ...existing]));
    localStorage.setItem(storeKey, JSON.stringify(updated));
    navigate('/learning-path');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Target job description or keywords</Label>
              <Textarea rows={6} value={jobText} onChange={(e) => setJobText(e.target.value)} />
              <p className="text-sm text-muted-foreground">We’ll suggest keywords and boost your ATS score as you add them.</p>
            </div>
            <div className="space-y-2">
              <Label>Current ATS score</Label>
              <div className="text-3xl font-bold">{Math.min(100, currentScore)}%</div>
              <p className="text-sm text-muted-foreground">+1% per relevant keyword added</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Suggested keywords</Label>
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 20).map((k) => (
                <Button key={k} type="button" variant="outline" size="sm" onClick={() => addKeyword(k)}>
                  + {k}
                </Button>
              ))}
              {suggestions.length === 0 && <p className="text-sm text-muted-foreground">No suggestions — great coverage!</p>}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={speakPrompt} className="gap-2">
                <Volume2 className="w-4 h-4" /> Voice prompt
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Add a certification</Label>
                <Textarea rows={2} value={newCert} onChange={(e) => setNewCert(e.target.value)} placeholder="e.g., Scrum Master, AWS Developer, Google Data Analytics" />
              </div>
              <div className="flex items-end">
                <Button type="button" onClick={addCertification} className="w-full md:w-auto">Add Certification</Button>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Label>Skill gap courses</Label>
            <div className="flex flex-wrap gap-2">
              {['Advanced React Patterns', 'TypeScript Deep Dive', 'AWS for Developers', 'Data Structures & Algorithms']
                .map((c) => (
                  <Button key={c} type="button" variant="secondary" size="sm" onClick={() => addCourseToLearningPath(c)}>
                    Add: {c}
                  </Button>
                ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onPrev} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Button type="button" onClick={onNext} className="gap-2">
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ATSOptimizationStep;
