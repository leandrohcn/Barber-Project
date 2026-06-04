'use client';

import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { AdminLayout } from '@/components/layout/AdminLayout';

export default function ServicosPage() {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Meus Serviços</h1>
        <p className="text-slate-500 mb-8">Gerenciamento do catálogo de serviços</p>
        
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-slate-500">Catálogo de serviços em desenvolvimento</p>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
