import { Button } from '@/components/ui/button';
import {
  Database,
  Inbox,
  Search,
  Zap,
  FileText,
  Users,
  BarChart3,
  Settings,
  Package,
  AlertCircle,
} from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="mb-6 p-6 rounded-full bg-gradient-gold-subtle glow-gold">
        {icon || <Inbox className="h-12 w-12 text-gold" />}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gold-shimmer">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        {description}
      </p>
      {action && (
        <div className="flex gap-3">
          <Button onClick={action.onClick} className="btn-gold hover-elevate-gold">
            {action.label}
          </Button>
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="hover-elevate-gold"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function NoDataEmptyState({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      icon={<Database className="h-12 w-12 text-gold" />}
      title="No data available"
      description="There's no data to display right now. Try refreshing or check back later."
      action={
        onRefresh
          ? {
              label: 'Refresh',
              onClick: onRefresh,
            }
          : undefined
      }
    />
  );
}

export function NoSearchResultsEmptyState({
  searchTerm,
  onClear,
}: {
  searchTerm?: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      icon={<Search className="h-12 w-12 text-gold" />}
      title={searchTerm ? `No results for "${searchTerm}"` : 'No results found'}
      description="We couldn't find anything matching your search. Try different keywords or filters."
      action={
        onClear
          ? {
              label: 'Clear search',
              onClick: onClear,
            }
          : undefined
      }
    />
  );
}

export function NoConnectionsEmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={<Zap className="h-12 w-12 text-gold" />}
      title="No connections yet"
      description="Connect to external services and APIs to start syncing data with your dashboard."
      action={
        onCreate
          ? {
              label: 'Add connection',
              onClick: onCreate,
            }
          : undefined
      }
      secondaryAction={{
        label: 'Learn more',
        onClick: () => console.log('Learn more about connections'),
      }}
    />
  );
}

export function NoActivitiesEmptyState() {
  return (
    <EmptyState
      icon={<BarChart3 className="h-12 w-12 text-gold" />}
      title="No recent activity"
      description="Your activity feed will show up here once you start using the platform."
    />
  );
}

export function NoTeamMembersEmptyState({ onInvite }: { onInvite?: () => void }) {
  return (
    <EmptyState
      icon={<Users className="h-12 w-12 text-gold" />}
      title="No team members yet"
      description="Invite your team to collaborate on projects and share insights together."
      action={
        onInvite
          ? {
              label: 'Invite team member',
              onClick: onInvite,
            }
          : undefined
      }
    />
  );
}

export function NoDocumentsEmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={<FileText className="h-12 w-12 text-gold" />}
      title="No documents found"
      description="Create your first document to get started with documentation and knowledge sharing."
      action={
        onCreate
          ? {
              label: 'Create document',
              onClick: onCreate,
            }
          : undefined
      }
    />
  );
}

export function NoSettingsEmptyState() {
  return (
    <EmptyState
      icon={<Settings className="h-12 w-12 text-gold" />}
      title="No settings available"
      description="Settings for this section haven't been configured yet."
    />
  );
}

export function NoPackagesEmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={<Package className="h-12 w-12 text-gold" />}
      title="No packages found"
      description="You haven't created any packages yet. Start by creating your first package."
      action={
        onCreate
          ? {
              label: 'Create package',
              onClick: onCreate,
            }
          : undefined
      }
    />
  );
}

export function ErrorEmptyState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon={<AlertCircle className="h-12 w-12 text-destructive" />}
      title="Something went wrong"
      description={
        message ||
        'We encountered an error while loading this data. Please try again.'
      }
      action={
        onRetry
          ? {
              label: 'Retry',
              onClick: onRetry,
            }
          : undefined
      }
    />
  );
}

// Specialized empty state for specific scenarios
export function ComingSoonEmptyState({ feature }: { feature: string }) {
  return (
    <EmptyState
      icon={<Zap className="h-12 w-12 text-gold" />}
      title={`${feature} coming soon`}
      description="We're working hard to bring you this feature. Stay tuned for updates!"
    />
  );
}
