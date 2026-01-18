import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Command, Search, Home, BarChart3, Link2, DollarSign, Settings, Zap } from "lucide-react";

const shortcuts = [
  {
    key: "⌘K / Ctrl+K",
    description: "Open command palette",
    icon: Command,
    action: "Search and navigate quickly",
  },
  {
    key: "/",
    description: "Focus search bar",
    icon: Search,
    action: "Jump to search",
  },
  {
    key: "G then D",
    description: "Go to Dashboard",
    icon: Home,
    action: "Navigate to dashboard page",
  },
  {
    key: "G then A",
    description: "Go to Analytics",
    icon: BarChart3,
    action: "Navigate to analytics page",
  },
  {
    key: "G then C",
    description: "Go to Connections",
    icon: Link2,
    action: "Navigate to API connections",
  },
  {
    key: "G then B",
    description: "Go to Billing",
    icon: DollarSign,
    action: "Navigate to billing page",
  },
  {
    key: "G then S",
    description: "Go to Settings",
    icon: Settings,
    action: "Navigate to settings page",
  },
  {
    key: "?",
    description: "Show keyboard shortcuts",
    icon: Zap,
    action: "Display this panel",
  },
];

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Show shortcuts panel with ?
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          return;
        }
        e.preventDefault();
        setIsOpen(true);
      }

      // Close with Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }

      // Focus search with /
      if (e.key === "/" && !isOpen) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          return;
        }
        e.preventDefault();
        const searchInput = document.querySelector('[data-testid="input-global-search"]') as HTMLInputElement;
        searchInput?.focus();
      }

      // Navigation shortcuts with G
      if (e.key === "g" && !isOpen) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
          return;
        }

        // Listen for next key
        const handleNextKey = (nextE: KeyboardEvent) => {
          switch (nextE.key) {
            case "d":
              window.location.href = "/";
              break;
            case "a":
              window.location.href = "/analytics";
              break;
            case "c":
              window.location.href = "/connections";
              break;
            case "b":
              window.location.href = "/billing";
              break;
            case "s":
              window.location.href = "/settings";
              break;
          }
          document.removeEventListener("keydown", handleNextKey);
        };

        document.addEventListener("keydown", handleNextKey);
        setTimeout(() => {
          document.removeEventListener("keydown", handleNextKey);
        }, 2000);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isOpen]);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-50 glass-card hover-elevate-gold hidden md:flex"
      >
        <Command className="w-4 h-4 mr-2" />
        Keyboard Shortcuts
      </Button>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-[9998] animate-fade-in" onClick={() => setIsOpen(false)} />

      {/* Shortcuts Panel */}
      <Card className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] glass-card border-yellow-500/30 shadow-2xl shadow-yellow-500/20 p-6 max-w-2xl w-full max-h-[80vh] overflow-auto animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center">
              <Command className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
              <p className="text-sm text-muted-foreground">Navigate faster with these shortcuts</p>
            </div>
          </div>
          <Button onClick={() => setIsOpen(false)} variant="ghost" size="icon">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon;
            return (
              <div key={shortcut.key} className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {shortcut.key}
                      </Badge>
                    </div>
                    <p className="font-semibold text-sm">{shortcut.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{shortcut.action}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <p className="text-sm text-yellow-500 font-semibold mb-1">Pro Tip</p>
          <p className="text-sm text-muted-foreground">
            Press <Badge variant="secondary" className="font-mono text-xs mx-1">?</Badge> anytime to view this panel
          </p>
        </div>
      </Card>
    </>
  );
}
