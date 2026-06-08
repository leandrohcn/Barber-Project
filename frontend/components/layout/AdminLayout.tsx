'use client';

import { Sidebar } from './Sidebar';
import { OrganizationProvider } from '@/lib/OrganizationContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <OrganizationProvider>
      <div className="flex h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 ml-64 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </OrganizationProvider>
  );
}
