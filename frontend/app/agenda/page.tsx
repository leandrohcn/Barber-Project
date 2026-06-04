'use client';

import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { AdminLayout } from '@/components/layout/AdminLayout';

export default function AgendaPage() {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Agenda</h1>
        <p className="text-slate-500 mb-8">Gerenciamento de atendimentos</p>
        
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-slate-500">Calendário e lista de agendamentos em desenvolvimento</p>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
