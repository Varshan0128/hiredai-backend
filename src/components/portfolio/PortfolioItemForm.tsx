
import React from 'react';
import { FileText, Briefcase, Plus, X, Link as LinkIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";
import { PortfolioItem } from '@/types/portfolio';

// Function to generate a unique ID
const generateId = () => `item-${Math.random().toString(36).substr(2, 9)}`;

interface PortfolioItemFormProps {
  onSave: (item: any) => void;
  onCancel: () => void;
  skills: string[];
  portfolioItems?: PortfolioItem[];
  updatePortfolioItems?: (items: PortfolioItem[]) => void;
}

const PortfolioItemForm: React.FC<PortfolioItemFormProps> = ({ 
  onSave,
  onCancel,
  skills,
  portfolioItems = [],
  updatePortfolioItems
}) => {
  const [newPortfolioItem, setNewPortfolioItem] = React.useState({
    title: "",
    description: "",
    role: "",
    date: "",
    link: "",
  });
  
  // Handle adding a new portfolio item
  const handleAddPortfolioItem = () => {
    if (!newPortfolioItem.title) {
      toast.error('Please enter at least a title for your portfolio item');
      return;
    }
    
    const newItem = {
      id: generateId(),
      title: newPortfolioItem.title,
      description: newPortfolioItem.description,
      role: newPortfolioItem.role,
      date: newPortfolioItem.date,
      link: newPortfolioItem.link,
      category: 'Project'
    };
    
    if (updatePortfolioItems && portfolioItems) {
      const updatedItems = [...portfolioItems, newItem];
      updatePortfolioItems(updatedItems);
    }

    // Use onSave for direct saving in PortfolioAttachmentForm
    onSave(newItem);
    
    setNewPortfolioItem({
      title: "",
      description: "",
      role: "",
      date: "",
      link: ""
    });
    toast.success('Portfolio item added');
  };
  
  // Handle removing a portfolio item
  const handleRemovePortfolioItem = (idToRemove: string) => {
    if (updatePortfolioItems && portfolioItems) {
      const updatedItems = portfolioItems.filter(item => item.id !== idToRemove);
      updatePortfolioItems(updatedItems);
      toast.success('Portfolio item removed');
    }
  };
  
  // Handle portfolio input change
  const handlePortfolioItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPortfolioItem(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Portfolio Projects</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2 text-sm font-medium">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                Project Title
              </Label>
              <Input 
                id="title" 
                name="title" 
                value={newPortfolioItem.title}
                onChange={handlePortfolioItemChange}
                placeholder="E.g., Company Website Redesign"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                Your Role
              </Label>
              <Input 
                id="role" 
                name="role" 
                value={newPortfolioItem.role}
                onChange={handlePortfolioItemChange}
                placeholder="E.g., Lead Designer"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Date Completed
              </Label>
              <Input 
                id="date" 
                name="date" 
                value={newPortfolioItem.date}
                onChange={handlePortfolioItemChange}
                placeholder="E.g., June 2023"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="link" className="flex items-center gap-2 text-sm font-medium">
                <LinkIcon className="w-4 h-4 text-muted-foreground" />
                Project Link
              </Label>
              <Input 
                id="link" 
                name="link" 
                type="url"
                value={newPortfolioItem.link}
                onChange={handlePortfolioItemChange}
                placeholder="E.g., https://example.com/my-project"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Project Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={newPortfolioItem.description}
                onChange={handlePortfolioItemChange}
                placeholder="Describe your role, responsibilities, and achievements in this project..."
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-between mt-4">
              <Button 
                type="button" 
                onClick={onCancel}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleAddPortfolioItem}
                variant="default"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Project
              </Button>
            </div>
          </div>
          
          {/* Display existing portfolio items if we're managing them here */}
          {updatePortfolioItems && portfolioItems && portfolioItems.length > 0 && (
            <div className="space-y-3 mt-4">
              {portfolioItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex flex-col gap-2 p-3 border rounded-md bg-secondary/20"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-primary">{item.title}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemovePortfolioItem(item.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {item.role && (
                    <p className="text-sm text-muted-foreground">Role: {item.role}</p>
                  )}
                  
                  {item.date && (
                    <p className="text-sm text-muted-foreground">Completed: {item.date}</p>
                  )}

                  {item.link && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" /> 
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                        {item.link}
                      </a>
                    </p>
                  )}
                  
                  {item.description && (
                    <p className="text-sm text-balance">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioItemForm;
