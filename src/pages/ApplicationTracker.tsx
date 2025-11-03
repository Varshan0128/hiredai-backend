
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import AnimatedBackground from '@/components/AnimatedBackground';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Building, 
  Plus,
  Search,
  Filter,
  FileEdit,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useBreakpoint } from '@/hooks/use-mobile';
import ApplicationStatusBadge from '@/components/applications/ApplicationStatusBadge';
import ApplicationForm from '@/components/applications/ApplicationForm';

export interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  dateApplied: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'no-response';
  location?: string;
  contactName?: string;
  contactEmail?: string;
  notes?: string;
  nextFollowUp?: string;
  salaryRange?: string;
  jobDescription?: string;
  applicationUrl?: string;
}

const STORAGE_KEY = 'job_applications_data';

const ApplicationTracker = () => {
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing saved applications:', error);
        return [];
      }
    }
    return [];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Application['status'] | 'all'>('all');
  
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();
  const isMobileView = breakpoint === 'mobile';

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  }, [applications]);

  const handleAddApplication = (application: Application) => {
    if (editingApplication) {
      setApplications(prevApplications => 
        prevApplications.map(app => app.id === application.id ? application : app)
      );
      toast.success('Application updated successfully!');
    } else {
      setApplications(prevApplications => [...prevApplications, application]);
      toast.success('Application added successfully!');
    }
    setShowForm(false);
    setEditingApplication(null);
  };

  const handleEditApplication = (application: Application) => {
    setEditingApplication(application);
    setShowForm(true);
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(prevApplications => prevApplications.filter(app => app.id !== id));
    toast.success('Application removed successfully!');
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingApplication(null);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.location && app.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    const counts = {
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
      'no-response': 0
    };
    
    applications.forEach(app => {
      counts[app.status]++;
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (showForm) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <AnimatedBackground />
        
        <main className="flex-1 pt-20 md:pt-28 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-card rounded-2xl p-4 md:p-8 lg:p-12 shadow-xl"
            >
              <ApplicationForm 
                onSubmit={handleAddApplication}
                onCancel={handleCancelForm}
                initialData={editingApplication || undefined}
              />
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <AnimatedBackground />
      
      <main className="flex-1 pt-20 md:pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl p-4 md:p-8 lg:p-12 shadow-xl"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Application Tracker</h1>
                <p className="text-muted-foreground">
                  Track and manage your job applications in one place
                </p>
              </div>
              <Button 
                onClick={() => setShowForm(true)}
                className="mt-4 md:mt-0"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Application
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <Card className="bg-primary/10 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-center">Applied</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-center">{statusCounts.applied}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-amber-500/10 border-amber-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-center">Interview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-center">{statusCounts.interview}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-green-500/10 border-green-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-center">Offers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-center">{statusCounts.offer}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-red-500/10 border-red-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-center">Rejected</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-center">{statusCounts.rejected}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-500/10 border-gray-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-center">No Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-center">{statusCounts['no-response']}</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by company, job title, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                  className="min-w-20"
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'applied' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('applied')}
                  className="min-w-20"
                >
                  Applied
                </Button>
                <Button
                  variant={statusFilter === 'interview' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('interview')}
                  className="min-w-20"
                >
                  Interview
                </Button>
              </div>
            </div>
            
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No applications found</h3>
                <p className="mt-2 text-muted-foreground">
                  {applications.length === 0 
                    ? "You haven't added any job applications yet." 
                    : "No applications match your search criteria."}
                </p>
                {applications.length === 0 && (
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Your First Application
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Date Applied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">{application.companyName}</TableCell>
                        <TableCell>{application.jobTitle}</TableCell>
                        <TableCell>{application.dateApplied}</TableCell>
                        <TableCell>
                          <ApplicationStatusBadge status={application.status} />
                        </TableCell>
                        <TableCell>{application.location || "—"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditApplication(application)}
                            >
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDeleteApplication(application.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ApplicationTracker;
