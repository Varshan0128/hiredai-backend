
import React from 'react';
import { Code, Building, GraduationCap, PenTool, Briefcase } from 'lucide-react';

interface CategoryIconProps {
  category?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category }) => {
  switch (category?.toLowerCase()) {
    case 'project':
      return <Code className="w-5 h-5 text-primary" />;
    case 'experience':
      return <Building className="w-5 h-5 text-primary" />;
    case 'education':
      return <GraduationCap className="w-5 h-5 text-primary" />;
    case 'design':
      return <PenTool className="w-5 h-5 text-primary" />;
    default:
      return <Briefcase className="w-5 h-5 text-primary" />;
  }
};

export default CategoryIcon;
