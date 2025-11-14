import { ApiConnectionCard } from "@/components/api-connection-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { SiStripe, SiGoogle, SiSlack, SiTwilio, SiSalesforce, SiShopify } from 'react-icons/si';
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Connections() {
  const { toast } = useToast();
  const [connections] = useState([
    {
      id: '1',
      serviceName: 'Stripe',
      status: 'connected' as const,
      lastSync: new Date('2025-11-14T10:30:00'),
      requestCount: 12543,
      avgLatency: 142,
      icon: <SiStripe className="h-6 w-6" />,
    },
    {
      id: '2',
      serviceName: 'Google Analytics',
      status: 'connected' as const,
      lastSync: new Date('2025-11-14T11:15:00'),
      requestCount: 8921,
      avgLatency: 89,
      icon: <SiGoogle className="h-6 w-6" />,
    },
    {
      id: '3',
      serviceName: 'Slack',
      status: 'error' as const,
      lastSync: new Date('2025-11-13T18:45:00'),
      requestCount: 432,
      avgLatency: 201,
      icon: <SiSlack className="h-6 w-6" />,
    },
    {
      id: '4',
      serviceName: 'Twilio',
      status: 'pending' as const,
      icon: <SiTwilio className="h-6 w-6" />,
    },
    {
      id: '5',
      serviceName: 'Salesforce',
      status: 'connected' as const,
      lastSync: new Date('2025-11-14T09:20:00'),
      requestCount: 5632,
      avgLatency: 176,
      icon: <SiSalesforce className="h-6 w-6" />,
    },
    {
      id: '6',
      serviceName: 'Shopify',
      status: 'connected' as const,
      lastSync: new Date('2025-11-14T10:50:00'),
      requestCount: 3421,
      avgLatency: 112,
      icon: <SiShopify className="h-6 w-6" />,
    },
  ]);

  const handleConfigure = (serviceName: string) => {
    toast({
      title: "Configuration",
      description: `Opening configuration for ${serviceName}...`,
    });
    console.log('Configure:', serviceName);
  };

  const handleTest = (serviceName: string) => {
    toast({
      title: "Testing Connection",
      description: `Testing ${serviceName} connection...`,
    });
    console.log('Test:', serviceName);
  };

  const handleAddConnection = () => {
    toast({
      title: "Add Connection",
      description: "Opening integration marketplace...",
    });
    console.log('Add new connection');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">API Connections</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your third-party API integrations
          </p>
        </div>
        <Button onClick={handleAddConnection} data-testid="button-add-connection">
          <Plus className="h-4 w-4 mr-2" />
          Add Connection
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map((connection) => (
          <ApiConnectionCard
            key={connection.id}
            {...connection}
            onConfigure={() => handleConfigure(connection.serviceName)}
            onTest={() => handleTest(connection.serviceName)}
          />
        ))}
        
        <Card className="hover-elevate border-dashed cursor-pointer" onClick={handleAddConnection} data-testid="card-add-new-connection">
          <CardHeader className="flex flex-col items-center justify-center h-full min-h-[200px]">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-base">Add New Connection</CardTitle>
            <CardDescription className="text-center mt-2">
              Connect to additional services and APIs
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
