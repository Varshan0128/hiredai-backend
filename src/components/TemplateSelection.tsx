import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Check, Eye, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AnimatedButton from './AnimatedButton';
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { ResumeData } from '@/pages/Builder';
import { templates, getTemplateById, applyTemplateStyles } from '@/services/templateService';
import { LATEX_TEMPLATES } from '@/templates/latex/templates';

interface TemplateSelectionProps {
  onNext: () => void;
  onPrev: () => void;
  data: ResumeData;
  updateData: (data: Partial<ResumeData>) => void;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({ 
  onNext, 
  onPrev,
  data,
  updateData 
}) => {
  const navigate = useNavigate();

  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(
    data.selectedTemplate && !data.selectedTemplate.startsWith('latex:')
      ? parseInt(data.selectedTemplate)
      : null
  );

  const [selectedLatex, setSelectedLatex] = useState<number | null>(
    data.selectedTemplate?.startsWith('latex:')
      ? parseInt((data.selectedTemplate || '').split(':')[1] || '0')
      : null
  );

  const [previewTemplate, setPreviewTemplate] = useState<typeof templates[0] | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleTemplateSelect = (id: number) => {
    setSelectedTemplate(id);
    const template = getTemplateById(id);

    if (template) {
      applyTemplateStyles(id);
      toast.success(`${template.name} template selected`);
      onNext();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedTemplate !== null || selectedLatex !== null) {
      const selectedTemplateObj =
        selectedTemplate !== null ? getTemplateById(selectedTemplate) : null;

      updateData({
        selectedTemplate:
          selectedTemplate !== null
            ? selectedTemplate.toString()
            : `latex:${selectedLatex}`,
        templateStyles: {
          primaryColor: selectedTemplateObj?.primaryColor,
          secondaryColor: selectedTemplateObj?.secondaryColor,
          fontFamily: selectedTemplateObj?.fontFamily,
        },
      });

      toast.success(
        `${selectedTemplateObj ? selectedTemplateObj.name : "Template"} selected successfully`
      );

      navigate("/builder", { state: { goToStep: 2 } });
    } else {
      toast.error("Please select a template to continue");
    }
  };

  const openPreview = (template: typeof templates[0], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setTimeout(() => setPreviewTemplate(null), 300);
  };

  const getSelectedTemplateName = () => {
    if (selectedLatex !== null) {
      return LATEX_TEMPLATES.find(t => t.id === selectedLatex)?.name || 'Unknown LaTeX template';
    }
    if (selectedTemplate === null) return "No template selected";
    const template = getTemplateById(selectedTemplate);
    return template ? template.name : "Unknown template";
  };

  const filteredTemplates = templates.filter(t => (t.atsScore ?? 0) >= 80);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex mb-4 p-3 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          >
            <FileText className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h2 
            className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text font-display"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Choose Your ATS-Optimized Template
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-balance max-w-md mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Select a professionally designed, ATS-friendly resume template suitable for top companies including FAANG.
          </motion.p>

          {(selectedTemplate !== null || selectedLatex !== null) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
            >
              Selected: <span className="font-medium ml-1">{getSelectedTemplateName()}</span>
            </motion.div>
          )}
        </div>

        {/* Templates grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex flex-col"
            >
              <Card
                className={`overflow-hidden cursor-pointer transition-all duration-300 h-full transform hover:scale-102 hover:shadow-lg ${
                  selectedTemplate === template.id
                    ? 'ring-2 ring-primary border-primary shadow-md'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="relative">
                  <img
                    src={template.imageSrc}
                    alt={template.name}
                    className="w-full h-48 object-cover object-top"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {template.bestseller && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-amber-400 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                      Bestseller
                    </div>
                  )}
                  {template.atsScore && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-green-600 to-green-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                      ATS Score: {template.atsScore}%
                    </div>
                  )}
                  {selectedTemplate === template.id && (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <div className="bg-primary text-white p-2 rounded-full shadow-lg">
                        <Check className="w-6 h-6" />
                      </div>
                    </div>
                  )}

                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-3 right-3 opacity-80 hover:opacity-100 flex items-center gap-1 text-xs font-medium shadow-md backdrop-blur-sm bg-white/70 text-gray-800 dark:bg-gray-800/70 dark:text-white"
                    onClick={(e) => openPreview(template, e)}
                  >
                    <Eye className="w-3 h-3" /> Preview
                  </Button>
                </div>

                <CardContent className="p-4 flex flex-col flex-1">
                  <h3 className="font-medium text-lg mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.features.map((feature, i) => (
                        <span
                          key={i}
                          className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <a
                      href={template.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary flex items-center gap-1 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View on Overleaf <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* LaTeX templates */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-3">LaTeX Templates (ATS ≥ 90)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {LATEX_TEMPLATES.filter(t => t.atsScore >= 90).map((t) => (
              <Card
                key={t.id}
                className={`overflow-hidden cursor-pointer transition-all duration-300 h-full transform hover:scale-102 hover:shadow-lg ${
                  selectedLatex === t.id
                    ? 'ring-2 ring-primary border-primary shadow-md'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => { setSelectedLatex(t.id); setSelectedTemplate(null); }}
              >
                <div className="relative">
                  <img
                    src={t.imageSrc || '/placeholder.svg'}
                    alt={t.name}
                    className="w-full h-48 object-cover object-top"
                  />
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-green-600 to-green-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                    ATS Score: {t.atsScore}%
                  </div>
                </div>
                <CardContent className="p-4 flex flex-col flex-1">
                  <h3 className="font-medium text-lg mb-1">{t.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t.description}</p>
                  <div className="mt-auto flex flex-wrap gap-1 mb-1">
                    {(t.features || []).map((feature, i) => (
                      <span
                        key={i}
                        className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-6 flex justify-between">
          <Button
            type="button"
            onClick={onPrev}
            variant="outline"
            className="flex items-center gap-2 border-2 hover:bg-muted/20"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <AnimatedButton
            type="submit"
            variant="default"
            className="w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md"
            disabled={selectedTemplate === null && selectedLatex === null}
          >
            <span>Continue to Resume Generation</span>
            <ArrowRight className="ml-2 w-4 h-4" />
          </AnimatedButton>
        </div>
      </form>

      {/* Preview dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          {previewTemplate && (
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-4">{previewTemplate.name} Preview</h3>
              <div className="relative overflow-hidden rounded-lg border shadow-md">
                <div className="p-6 bg-white dark:bg-gray-800 text-black dark:text-white">
                  {previewTemplate.content ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: previewTemplate.content
                          .replace(/{{(\w+)}}/g, '(Your $1)')
                          .replace(/{{#(\w+)}}[\s\S]*?{{\/\1}}/g, ''),
                      }}
                      style={{
                        fontFamily: previewTemplate.fontFamily,
                        '--template-primary': previewTemplate.primaryColor,
                        '--template-secondary': previewTemplate.secondaryColor,
                      } as React.CSSProperties}
                    />
                  ) : (
                    <img
                      src={previewTemplate.previewSrc}
                      alt={`${previewTemplate.name} Preview`}
                      className="w-full object-contain"
                    />
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  Close preview
                </Button>
                <Button
                  variant="default"
                  className="mt-2"
                  onClick={() => {
                    handleTemplateSelect(previewTemplate.id);
                    closePreview();
                  }}
                >
                  Select This Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default TemplateSelection;
