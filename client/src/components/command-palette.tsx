import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Home,
  BarChart3,
  Settings,
  Zap,
  Users,
  Database,
  Moon,
  Sun,
  Search,
  FileText,
  Download,
  Bell,
  Key,
  Activity,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  keywords?: string[];
  action: () => void;
  group: 'navigation' | 'actions' | 'settings' | 'recent';
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();

  // Command palette keyboard shortcut (⌘K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const navigate = useCallback((path: string) => {
    setLocation(path);
    setOpen(false);
  }, [setLocation]);

  const commands: Command[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      icon: <Home className="h-4 w-4" />,
      keywords: ['home', 'overview'],
      action: () => navigate('/'),
      group: 'navigation',
    },
    {
      id: 'nav-analytics',
      label: 'Go to Analytics',
      icon: <BarChart3 className="h-4 w-4" />,
      keywords: ['charts', 'data', 'metrics'],
      action: () => navigate('/analytics'),
      group: 'navigation',
    },
    {
      id: 'nav-connections',
      label: 'Go to Connections',
      icon: <Zap className="h-4 w-4" />,
      keywords: ['api', 'integrations'],
      action: () => navigate('/connections'),
      group: 'navigation',
    },
    {
      id: 'nav-settings',
      label: 'Go to Settings',
      icon: <Settings className="h-4 w-4" />,
      keywords: ['preferences', 'config'],
      action: () => navigate('/settings'),
      group: 'navigation',
    },

    // Actions
    {
      id: 'action-export-csv',
      label: 'Export Data as CSV',
      icon: <Download className="h-4 w-4" />,
      keywords: ['download', 'save', 'export'],
      action: () => {
        console.log('Exporting CSV...');
        setOpen(false);
      },
      group: 'actions',
    },
    {
      id: 'action-export-json',
      label: 'Export Data as JSON',
      icon: <FileText className="h-4 w-4" />,
      keywords: ['download', 'save', 'export'],
      action: () => {
        console.log('Exporting JSON...');
        setOpen(false);
      },
      group: 'actions',
    },
    {
      id: 'action-search',
      label: 'Search Everything',
      icon: <Search className="h-4 w-4" />,
      keywords: ['find', 'lookup'],
      action: () => {
        document.querySelector('[data-testid="input-global-search"]')?.focus();
        setOpen(false);
      },
      group: 'actions',
    },
    {
      id: 'action-notifications',
      label: 'View Notifications',
      icon: <Bell className="h-4 w-4" />,
      keywords: ['alerts', 'updates'],
      action: () => {
        document.querySelector('[data-testid="button-notifications"]')?.click();
        setOpen(false);
      },
      group: 'actions',
    },

    // Settings
    {
      id: 'setting-theme-light',
      label: 'Switch to Light Theme',
      icon: <Sun className="h-4 w-4" />,
      keywords: ['appearance', 'brightness'],
      action: () => {
        setTheme('light');
        setOpen(false);
      },
      group: 'settings',
    },
    {
      id: 'setting-theme-dark',
      label: 'Switch to Dark Theme',
      icon: <Moon className="h-4 w-4" />,
      keywords: ['appearance', 'darkness'],
      action: () => {
        setTheme('dark');
        setOpen(false);
      },
      group: 'settings',
    },
    {
      id: 'setting-api-keys',
      label: 'Manage API Keys',
      icon: <Key className="h-4 w-4" />,
      keywords: ['security', 'authentication', 'tokens'],
      action: () => navigate('/settings?tab=api-keys'),
      group: 'settings',
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." className="text-base" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {commands
            .filter((cmd) => cmd.group === 'navigation')
            .map((cmd) => (
              <CommandItem
                key={cmd.id}
                onSelect={cmd.action}
                className="hover-elevate-gold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {cmd.icon}
                  <span>{cmd.label}</span>
                </div>
              </CommandItem>
            ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          {commands
            .filter((cmd) => cmd.group === 'actions')
            .map((cmd) => (
              <CommandItem
                key={cmd.id}
                onSelect={cmd.action}
                className="hover-elevate-gold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {cmd.icon}
                  <span>{cmd.label}</span>
                </div>
              </CommandItem>
            ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          {commands
            .filter((cmd) => cmd.group === 'settings')
            .map((cmd) => (
              <CommandItem
                key={cmd.id}
                onSelect={cmd.action}
                className="hover-elevate-gold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {cmd.icon}
                  <span>{cmd.label}</span>
                </div>
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>

      <div className="border-t p-2 text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘K</kbd>
          <span>to open/close</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">↑↓</kbd>
          <span>to navigate</span>
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">↵</kbd>
          <span>to select</span>
        </div>
      </div>
    </CommandDialog>
  );
}
