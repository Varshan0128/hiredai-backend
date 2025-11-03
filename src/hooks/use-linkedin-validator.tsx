
import { useState } from 'react';

export function useLinkedInValidator() {
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const validateLinkedInUrl = (url: string) => {
    setIsValidating(true);
    setValidationError(null);
    
    // Basic validation for LinkedIn URL format
    const linkedInRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
    
    if (!url) {
      setValidationError("Please enter a LinkedIn URL");
      setIsValidating(false);
      return false;
    }
    
    if (!linkedInRegex.test(url)) {
      setValidationError("Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)");
      setIsValidating(false);
      return false;
    }
    
    setIsValidating(false);
    return true;
  };
  
  return {
    isValidating,
    validationError,
    validateLinkedInUrl
  };
}
