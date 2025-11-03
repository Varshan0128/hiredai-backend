
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  LinkIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { Application } from '@/pages/ApplicationTracker';

interface ApplicationFormProps {
  onSubmit: (application: Application) => void;
  onCancel: () => void;
  initialData?: Application;
}

const formatDate = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const [application, setApplication] = useState<Application>(
    initialData || {
      id: uuidv4(),
      companyName: '',
      jobTitle: '',
      dateApplied: formatDate(new Date()),
      status: 'applied',
      location: '',
      contactName: '',
      contactEmail: '',
      notes: '',
      salaryRange: '',
      jobDescription: '',
      applicationUrl: ''
    }
  );

  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [followUpPopoverOpen, setFollowUpPopoverOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setApplication(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setApplication(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (name: string, date: Date | undefined) => {
    if (date) {
      setApplication(prev => ({ ...prev, [name]: formatDate(date) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(application);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onCancel}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-semibold">
          {initialData ? 'Edit Application' : 'Add New Application'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              name="companyName"
              placeholder="Enter company name"
              value={application.companyName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title *</Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              placeholder="Enter job title"
              value={application.jobTitle}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="dateApplied">Date Applied *</Label>
            <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !application.dateApplied && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {application.dateApplied ? application.dateApplied : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={application.dateApplied ? new Date(application.dateApplied) : undefined}
                  onSelect={(date) => {
                    handleDateSelect('dateApplied', date);
                    setDatePopoverOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select 
              value={application.status} 
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="no-response">No Response</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Remote, City, State, etc."
              value={application.location || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Name</Label>
            <Input
              id="contactName"
              name="contactName"
              placeholder="Recruiter or hiring manager"
              value={application.contactName || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              placeholder="contact@company.com"
              value={application.contactEmail || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="salaryRange">Salary Range</Label>
            <Input
              id="salaryRange"
              name="salaryRange"
              placeholder="e.g. $80,000 - $100,000"
              value={application.salaryRange || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nextFollowUp">Next Follow Up</Label>
            <Popover open={followUpPopoverOpen} onOpenChange={setFollowUpPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !application.nextFollowUp && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {application.nextFollowUp ? application.nextFollowUp : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={application.nextFollowUp ? new Date(application.nextFollowUp) : undefined}
                  onSelect={(date) => {
                    handleDateSelect('nextFollowUp', date);
                    setFollowUpPopoverOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="applicationUrl">Application URL</Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="applicationUrl"
              name="applicationUrl"
              placeholder="https://company.com/jobs/123"
              value={application.applicationUrl || ''}
              onChange={handleChange}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="jobDescription">Job Description</Label>
          <Textarea
            id="jobDescription"
            name="jobDescription"
            placeholder="Enter the job description or key requirements"
            value={application.jobDescription || ''}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Add any personal notes about this application"
            value={application.notes || ''}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Application' : 'Save Application'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
