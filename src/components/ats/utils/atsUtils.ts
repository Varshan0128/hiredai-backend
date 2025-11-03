
import { toast } from "sonner";

export const validateInputs = (resumeText: string, jobDescription: string): boolean => {
  if (!resumeText.trim()) {
    toast.error("Please enter your resume text");
    return false;
  }
  
  if (!jobDescription.trim()) {
    toast.error("Please enter the job description");
    return false;
  }
  
  if (resumeText.trim().length < 50) {
    toast.error("Resume is too short. Please provide a more detailed resume.");
    return false;
  }
  
  if (jobDescription.trim().length < 50) {
    toast.error("Job description is too short. Please provide a more detailed job description.");
    return false;
  }
  
  return true;
};

export const handleResumeFile = async (
  file: File | undefined, 
  setResumeText: (text: string) => void
): Promise<void> => {
  if (!file) return;
  
  if (file.type !== 'text/plain' && file.type !== 'application/pdf' && 
      file.type !== 'application/msword' && 
      file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    toast.error("Please upload a text, PDF, or Word document");
    return;
  }
  
  try {
    // For this example, we'll just handle text files directly
    // For PDF and Word, you'd need server-side processing
    if (file.type === 'text/plain') {
      const text = await file.text();
      setResumeText(text);
      toast.success("Resume uploaded successfully!");
    } else {
      // Just extract content as text (this won't work well with PDFs/Word docs)
      // A proper implementation would use server-side processing
      try {
        const text = await file.text();
        setResumeText(text);
        toast.success("Resume uploaded, but formatting may be affected");
      } catch (err) {
        toast.error("Failed to read file format. Try copying and pasting the content instead.");
      }
    }
  } catch (err) {
    toast.error("Failed to read file. Try copying and pasting instead.");
  }
};
