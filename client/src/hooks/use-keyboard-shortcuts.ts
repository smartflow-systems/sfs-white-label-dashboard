import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean; // ⌘ on Mac, ⊞ on Windows
  description: string;
  action: () => void;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const {
          key,
          ctrl = false,
          alt = false,
          shift = false,
          meta = false,
          action,
          preventDefault = true,
        } = shortcut;

        const keyMatch = event.key.toLowerCase() === key.toLowerCase();
        const ctrlMatch = ctrl === event.ctrlKey;
        const altMatch = alt === event.altKey;
        const shiftMatch = shift === event.shiftKey;
        const metaMatch = meta === event.metaKey;

        if (keyMatch && ctrlMatch && altMatch && shiftMatch && metaMatch) {
          if (preventDefault) {
            event.preventDefault();
          }
          action();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Hook for a single shortcut
export function useKeyboardShortcut(
  key: string,
  action: () => void,
  options: Omit<KeyboardShortcut, 'key' | 'action' | 'description'> = {}
) {
  useKeyboardShortcuts([
    {
      key,
      description: '',
      action,
      ...options,
    },
  ]);
}

// Common keyboard shortcuts
export const SHORTCUTS = {
  COMMAND_PALETTE: { key: 'k', meta: true, description: 'Open command palette' },
  SEARCH: { key: '/', description: 'Focus search' },
  NEW_ITEM: { key: 'n', meta: true, description: 'Create new item' },
  SAVE: { key: 's', meta: true, description: 'Save' },
  REFRESH: { key: 'r', meta: true, description: 'Refresh data' },
  HELP: { key: '?', shift: true, description: 'Show help' },
  CLOSE: { key: 'Escape', description: 'Close modal/dialog' },
  NEXT: { key: 'ArrowDown', description: 'Next item' },
  PREVIOUS: { key: 'ArrowUp', description: 'Previous item' },
  SELECT: { key: 'Enter', description: 'Select item' },
} as const;
