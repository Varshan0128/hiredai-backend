import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Briefcase, Code, Clock } from 'lucide-react';

interface JobFiltersType {
  experience: string;
  location: string;
  skills: string[];
  jobTitle: string;
}

interface JobFiltersProps {
  filters: JobFiltersType;
  onFilterChange: (filters: Partial<JobFiltersType>) => void;
  onApplyFilters: () => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({ 
  filters, 
  onFilterChange, 
  onApplyFilters 
}) => {
  const [skillInput, setSkillInput] = React.useState('');

  const majorIndianCities = [
    'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 
    'Pune', 'Kolkata', 'Gurgaon', 'Noida', 'Ahmedabad'
  ];

  const experienceLevels = [
    { value: 'entry', label: '0-2 years (Entry Level)' },
    { value: 'mid', label: '3-5 years (Mid Level)' },
    { value: 'senior', label: '6-8 years (Senior)' },
    { value: 'lead', label: '9+ years (Lead/Principal)' }
  ];

  const commonSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'Angular',
    'Vue.js', 'TypeScript', 'MongoDB', 'SQL', 'AWS', 'Docker',
    'Kubernetes', 'Spring Boot', 'Express.js', 'REST API'
  ];

  const handleAddSkill = (skill: string) => {
    if (skill && !filters.skills.includes(skill)) {
      onFilterChange({
        skills: [...filters.skills, skill]
      });
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onFilterChange({
      skills: filters.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSkillInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      handleAddSkill(skillInput.trim());
    }
  };

  const clearAllFilters = () => {
    onFilterChange({
      experience: '',
      location: '',
      skills: [],
      jobTitle: ''
    });
  };

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Filters
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Job Title */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Briefcase className="h-4 w-4" />
            Job Title
          </Label>
          <Input
            placeholder="e.g. Software Developer"
            value={filters.jobTitle}
            onChange={(e) => onFilterChange({ jobTitle: e.target.value })}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4" />
            Location
          </Label>
          <Select 
            value={filters.location} 
            onValueChange={(value) => onFilterChange({ location: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="India">All India</SelectItem>
              {majorIndianCities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4" />
            Experience Level
          </Label>
          <Select 
            value={filters.experience} 
            onValueChange={(value) => onFilterChange({ experience: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map(level => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Code className="h-4 w-4" />
            Skills
          </Label>
          
          {/* Skill Input */}
          <Input
            placeholder="Add a skill and press Enter"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={handleSkillInputKeyPress}
          />

          {/* Quick Add Common Skills */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Quick add:</p>
            <div className="flex flex-wrap gap-1">
              {commonSkills.slice(0, 8).map(skill => (
                <Button
                  key={skill}
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => handleAddSkill(skill)}
                  disabled={filters.skills.includes(skill)}
                >
                  {skill}
                </Button>
              ))}
            </div>
          </div>

          {/* Selected Skills */}
          {filters.skills.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Selected skills:</p>
              <div className="flex flex-wrap gap-1">
                {filters.skills.map(skill => (
                  <Badge 
                    key={skill} 
                    variant="secondary"
                    className="text-xs flex items-center gap-1"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Apply Filters Button */}
        <Button 
          onClick={onApplyFilters} 
          className="w-full"
          size="sm"
        >
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobFilters;