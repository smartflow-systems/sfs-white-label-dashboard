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
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Dashboard from "@/pages/dashboard";
import Analytics from "@/pages/analytics";
import Connections from "@/pages/connections";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

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
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar tenantName={selectedTenant.name} />
              <div className="flex flex-col flex-1 min-w-0">
                <header className="flex items-center justify-between gap-4 p-4 border-b h-16 shrink-0">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
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
                        placeholder="Search..."
                        className="pl-9 w-64"
                        data-testid="input-global-search"
                      />
                    </div>
                    <Button variant="ghost" size="icon" data-testid="button-notifications">
                      <Bell className="h-5 w-5" />
                    </Button>
                    <ThemeToggle />
                    <Avatar className="h-8 w-8" data-testid="avatar-user">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
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
