import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Recommendation } from '@/types';

interface AlertCardProps {
  recommendation: Recommendation;
  className?: string;
}

const typeConfig = {
  alert: {
    icon: AlertCircle,
    color: 'text-danger',
    bg: 'bg-danger/5 border-danger/30',
    badge: 'destructive',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-warning',
    bg: 'bg-warning/5 border-warning/30',
    badge: 'warning',
  },
  suggestion: {
    icon: Lightbulb,
    color: 'text-primary',
    bg: 'bg-primary/5 border-primary/30',
    badge: 'default',
  },
  success: {
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success/5 border-success/30',
    badge: 'success',
  },
  info: {
    icon: Info,
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
    badge: 'secondary',
  },
} as const;

const priorityLabels = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export function AlertCard({ recommendation, className }: AlertCardProps) {
  const config = typeConfig[recommendation.type];
  const Icon = config.icon;

  return (
    <Card className={cn(config.bg, className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className={cn('h-5 w-5', config.color)} />
            <CardTitle className="text-base">{recommendation.title}</CardTitle>
          </div>
          <Badge variant={config.badge as any} className="text-xs">
            {priorityLabels[recommendation.priority]}
          </Badge>
        </div>
        <CardDescription className="mt-2">{recommendation.message}</CardDescription>
      </CardHeader>
      {recommendation.actionable && recommendation.action && (
        <CardContent className="pt-0">
          <div className="text-sm font-medium text-muted-foreground">
            <span className="font-semibold">Action: </span>
            {recommendation.action}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
