
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from 'lucide-react';
import { PortfolioItem } from '@/types/portfolio';
import CategoryIcon from './CategoryIcon';

interface PortfolioItemCardProps {
  item: PortfolioItem;
}

const PortfolioItemCard: React.FC<PortfolioItemCardProps> = ({ item }) => {
  return (
    <Card key={item.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 flex items-center gap-2">
          <CategoryIcon category={item.category} />
          <div>
            <h3 className="text-xl font-semibold">{item.title}</h3>
            {item.role && <p className="text-sm text-muted-foreground">Role: {item.role}</p>}
            {item.date && <p className="text-sm text-muted-foreground">Completed: {item.date}</p>}
          </div>
        </div>
        <div className="p-4">
          <p className="mb-2">{item.description}</p>
          {item.technologies && item.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.technologies.map((tech, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
          {item.link && (
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary flex items-center gap-1 hover:underline mt-2"
            >
              <Link className="w-4 h-4" /> View Project
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioItemCard;
