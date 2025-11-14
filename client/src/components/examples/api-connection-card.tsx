import { ApiConnectionCard } from '../api-connection-card';
import { SiStripe, SiGoogle, SiSlack, SiTwilio } from 'react-icons/si';

export default function ApiConnectionCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      <ApiConnectionCard
        serviceName="Stripe"
        status="connected"
        lastSync={new Date('2025-11-14T10:30:00')}
        requestCount={12543}
        avgLatency={142}
        icon={<SiStripe className="h-6 w-6" />}
        onConfigure={() => console.log('Configure Stripe')}
        onTest={() => console.log('Test Stripe')}
      />
      <ApiConnectionCard
        serviceName="Google Analytics"
        status="connected"
        lastSync={new Date('2025-11-14T11:15:00')}
        requestCount={8921}
        avgLatency={89}
        icon={<SiGoogle className="h-6 w-6" />}
        onConfigure={() => console.log('Configure Google Analytics')}
        onTest={() => console.log('Test Google Analytics')}
      />
      <ApiConnectionCard
        serviceName="Slack"
        status="error"
        lastSync={new Date('2025-11-13T18:45:00')}
        requestCount={432}
        avgLatency={201}
        icon={<SiSlack className="h-6 w-6" />}
        onConfigure={() => console.log('Configure Slack')}
        onTest={() => console.log('Test Slack')}
      />
      <ApiConnectionCard
        serviceName="Twilio"
        status="pending"
        icon={<SiTwilio className="h-6 w-6" />}
        onConfigure={() => console.log('Configure Twilio')}
        onTest={() => console.log('Test Twilio')}
      />
    </div>
  );
}
