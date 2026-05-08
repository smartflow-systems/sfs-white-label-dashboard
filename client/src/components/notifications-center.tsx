import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  Check,
  AlertCircle,
  Info,
  TrendingUp,
  Users,
  Zap,
  CheckCheck,
  Trash2,
  Settings,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'API deployment successful',
    message: 'Your API changes have been deployed to production.',
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
    actionable: true,
    actionLabel: 'View logs',
    onAction: () => console.log('View logs'),
  },
  {
    id: '2',
    type: 'warning',
    title: 'High API latency detected',
    message: 'Average response time increased to 450ms in the last hour.',
    timestamp: new Date(Date.now() - 15 * 60000),
    read: false,
    actionable: true,
    actionLabel: 'Investigate',
    onAction: () => console.log('Investigate'),
  },
  {
    id: '3',
    type: 'info',
    title: 'New team member added',
    message: 'Sarah Johnson has been added to your workspace.',
    timestamp: new Date(Date.now() - 60 * 60000),
    read: true,
  },
  {
    id: '4',
    type: 'success',
    title: 'Revenue milestone reached',
    message: 'Congratulations! You\'ve reached $50,000 in monthly revenue.',
    timestamp: new Date(Date.now() - 2 * 60 * 60000),
    read: true,
    actionable: true,
    actionLabel: 'View analytics',
    onAction: () => console.log('View analytics'),
  },
  {
    id: '5',
    type: 'error',
    title: 'Failed webhook delivery',
    message: '5 webhook deliveries failed to endpoint "https://api.example.com/webhook".',
    timestamp: new Date(Date.now() - 3 * 60 * 60000),
    read: false,
    actionable: true,
    actionLabel: 'Retry',
    onAction: () => console.log('Retry webhooks'),
  },
];

const getNotificationIcon = (type: Notification['type']) => {
  const iconClass = 'h-4 w-4';
  switch (type) {
    case 'success':
      return <Check className={`${iconClass} text-green-500`} />;
    case 'warning':
      return <AlertCircle className={`${iconClass} text-yellow-500`} />;
    case 'error':
      return <AlertCircle className={`${iconClass} text-red-500`} />;
    default:
      return <Info className={`${iconClass} text-blue-500`} />;
  }
};

export function NotificationsCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div
      className={`p-3 rounded-lg glass-card hover-elevate-gold transition-all ${
        !notification.read ? 'bg-accent/10' : ''
      }`}
      onClick={() => !notification.read && markAsRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium leading-none mb-1">
              {notification.title}
            </h4>
            {!notification.read && (
              <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {notification.message}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
            </span>
            {notification.actionable && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-primary hover-elevate-gold"
                onClick={(e) => {
                  e.stopPropagation();
                  notification.onAction?.();
                }}
              >
                {notification.actionLabel}
              </Button>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            deleteNotification(notification.id);
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover-elevate-gold"
          data-testid="button-notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] pulse-gold"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[420px] p-0 glass-card"
        align="end"
        sideOffset={8}
      >
        <div className="p-4 border-b border-border-gold">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gold-shimmer">
              Notifications
            </h3>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs hover-elevate-gold"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover-elevate-gold"
              >
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-4 rounded-none border-b">
            <TabsTrigger value="all" className="text-xs">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="important" className="text-xs">
              Important
            </TabsTrigger>
            <TabsTrigger value="mentions" className="text-xs">
              @Mentions
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px]">
            <TabsContent value="all" className="mt-0 p-3 space-y-2">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                  <h4 className="text-sm font-medium mb-1">All caught up!</h4>
                  <p className="text-xs text-muted-foreground">
                    No notifications to display
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="unread" className="mt-0 p-3 space-y-2">
              {notifications.filter((n) => !n.read).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCheck className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                  <h4 className="text-sm font-medium mb-1">All caught up!</h4>
                  <p className="text-xs text-muted-foreground">
                    No unread notifications
                  </p>
                </div>
              ) : (
                notifications
                  .filter((n) => !n.read)
                  .map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))
              )}
            </TabsContent>

            <TabsContent value="important" className="mt-0 p-3 space-y-2">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                <h4 className="text-sm font-medium mb-1">No important notifications</h4>
                <p className="text-xs text-muted-foreground">
                  Important alerts will appear here
                </p>
              </div>
            </TabsContent>

            <TabsContent value="mentions" className="mt-0 p-3 space-y-2">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                <h4 className="text-sm font-medium mb-1">No mentions</h4>
                <p className="text-xs text-muted-foreground">
                  When someone mentions you, it'll show up here
                </p>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {notifications.length > 0 && (
          <div className="p-2 border-t border-border-gold flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-destructive hover:text-destructive hover-elevate-gold"
              onClick={clearAll}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear all
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs hover-elevate-gold"
            >
              View all notifications →
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
