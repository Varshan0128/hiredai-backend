
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  role?: string;
  date?: string;
  link?: string;
  imageUrl?: string; // Optional image URL for visual representation
  category?: string; // Optional category for organization
  technologies?: string[]; // Optional list of technologies used
  skills?: string[]; // Optional skills demonstrated
  theme?: string; // Optional theme selection for portfolio display
  layout?: 'grid' | 'list' | 'card'; // Optional layout preference
}

export type PortfolioTheme = 'professional' | 'creative' | 'minimal' | 'bold' | 'tech';
export type PortfolioLayout = 'grid' | 'list' | 'card';
export type PortfolioFormat = 'pdf' | 'pptx' | 'png';

export interface PortfolioGeneration {
  isGenerating: boolean;
  theme: PortfolioTheme;
  layout: PortfolioLayout;
  format: PortfolioFormat;
}
