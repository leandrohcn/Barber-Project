'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { api } from './api';

interface Organization {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

interface OrganizationContextType {
  organization: Organization | null;
  loading: boolean;
  refreshOrganization: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshOrganization = async () => {
    if (!user?.organizationId) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.getOrganization(user.organizationId);
      setOrganization(response.data);
    } catch (err) {
      console.error('Erro ao carregar organização:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshOrganization();
  }, [user?.organizationId]);

  return (
    <OrganizationContext.Provider value={{ organization, loading, refreshOrganization }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization deve ser usado dentro de OrganizationProvider');
  }
  return context;
}
