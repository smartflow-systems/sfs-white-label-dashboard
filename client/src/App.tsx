import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TenantSelector } from "@/components/tenant-selector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Dashboard from "@/pages/dashboard";
import Analytics from "@/pages/analytics";
import Connections from "@/pages/connections";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import { CircuitBackground } from "@/components/circuit-background";
import { CommandPalette } from "@/components/command-palette";
import { NotificationsCenter } from "@/components/notifications-center";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/connections" component={Connections} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const mockTenants = [
    { id: '1', name: 'Acme Corp', subdomain: 'acme' },
    { id: '2', name: 'TechStart Inc', subdomain: 'techstart' },
    { id: '3', name: 'Global Solutions', subdomain: 'global' },
    { id: '4', name: 'Innovation Labs', subdomain: 'innovation' },
  ];

  const [selectedTenant, setSelectedTenant] = useState(mockTenants[0]);

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          {/* Golden Circuit Background */}
          <CircuitBackground />

          {/* Command Palette (⌘K) */}
          <CommandPalette />

          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full relative circuit-container">
              <AppSidebar tenantName={selectedTenant.name} />
              <div className="flex flex-col flex-1 min-w-0">
                <header className="flex items-center justify-between gap-4 p-4 border-b border-border-gold h-16 shrink-0 glass-card sticky top-0 z-50">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger data-testid="button-sidebar-toggle" className="hover-elevate-gold" />
                    <TenantSelector
                      tenants={mockTenants}
                      selectedTenant={selectedTenant}
                      onSelectTenant={setSelectedTenant}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative hidden md:block">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search... (press / to focus)"
                        className="pl-9 w-64 glass-card hover-elevate-gold border-border-gold focus:border-primary"
                        data-testid="input-global-search"
                      />
                    </div>
                    <NotificationsCenter />
                    <ThemeToggle />
                    <Avatar className="h-8 w-8 hover-elevate-gold cursor-pointer transition-all" data-testid="avatar-user">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-gold text-black text-xs font-semibold">
                        JD
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </header>
                <main className="flex-1 overflow-auto">
                  <div className="max-w-7xl mx-auto p-6">
                    <Router />
                  </div>
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
