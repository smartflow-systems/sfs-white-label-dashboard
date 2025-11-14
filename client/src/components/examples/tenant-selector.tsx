import { useState } from 'react';
import { TenantSelector } from '../tenant-selector';

export default function TenantSelectorExample() {
  const mockTenants = [
    { id: '1', name: 'Acme Corp', subdomain: 'acme' },
    { id: '2', name: 'TechStart Inc', subdomain: 'techstart' },
    { id: '3', name: 'Global Solutions', subdomain: 'global' },
    { id: '4', name: 'Innovation Labs', subdomain: 'innovation' },
  ];

  const [selectedTenant, setSelectedTenant] = useState(mockTenants[0]);

  return (
    <div className="p-6">
      <TenantSelector
        tenants={mockTenants}
        selectedTenant={selectedTenant}
        onSelectTenant={(tenant) => {
          setSelectedTenant(tenant);
          console.log('Selected tenant:', tenant);
        }}
      />
    </div>
  );
}
