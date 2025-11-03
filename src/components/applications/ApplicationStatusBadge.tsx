
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, XCircle, CircleEllipsis, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApplicationStatusBadgeProps {
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'no-response';
  showIcon?: boolean;
  className?: string;
}

const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({
  status,
  showIcon = true,
  className
}) => {
  const statusConfig = {
    applied: {
      label: 'Applied',
      color: 'bg-primary/20 text-primary hover:bg-primary/30 border-primary/40',
      icon: Clock
    },
    interview: {
      label: 'Interview',
      color: 'bg-amber-500/20 text-amber-600 hover:bg-amber-500/30 border-amber-500/40',
      icon: CircleEllipsis
    },
    offer: {
      label: 'Offer',
      color: 'bg-green-500/20 text-green-600 hover:bg-green-500/30 border-green-500/40',
      icon: BadgeCheck
    },
    rejected: {
      label: 'Rejected',
      color: 'bg-red-500/20 text-red-600 hover:bg-red-500/30 border-red-500/40',
      icon: XCircle
    },
    'no-response': {
      label: 'No Response',
      color: 'bg-gray-500/20 text-gray-600 hover:bg-gray-500/30 border-gray-500/40',
      icon: Clock
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn(config.color, className)}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  );
};

export default ApplicationStatusBadge;
