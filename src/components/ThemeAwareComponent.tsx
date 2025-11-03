import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ThemeAwareComponentProps {
  children: React.ReactNode;
  className?: string;
  lightModeClasses?: string;
  darkModeClasses?: string;
}

const ThemeAwareComponent: React.FC<ThemeAwareComponentProps> = ({
  children,
  className = '',
  lightModeClasses = '',
  darkModeClasses = ''
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Get theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    
    // Listen for theme changes
    const handleStorageChange = () => {
      const newTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (newTheme) {
        setTheme(newTheme);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom theme change events
    const handleThemeChange = (event: CustomEvent) => {
      setTheme(event.detail.theme);
    };
    
    window.addEventListener('themeChange', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChange', handleThemeChange as EventListener);
    };
  }, []);

  return (
    <div
      className={cn(
        className,
        theme === 'light' ? lightModeClasses : darkModeClasses
      )}
    >
      {children}
    </div>
  );
};

export default ThemeAwareComponent;