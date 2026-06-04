'use client';

import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  // Metrics
  const metrics = [
    {
      label: 'Agendamentos hoje',
      value: '12',
      icon: Calendar,
      color: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      label: 'Receita (mês)',
      value: formatCurrency(2845),
      icon: DollarSign,
      color: 'bg-emerald-100',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Clientes ativos',
      value: '47',
      icon: Users,
      color: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      label: 'Taxa de ocupação',
      value: '84%',
      icon: TrendingUp,
      color: 'bg-amber-100',
      textColor: 'text-amber-600',
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Visão Geral
        </h1>
        <p className="text-slate-500">
          Resumo das atividades de hoje
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardBody className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {metric.value}
                  </p>
                </div>
                <div className={`${metric.color} p-3 rounded-full`}>
                  <Icon className={`w-6 h-6 ${metric.textColor}`} />
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-slate-900">
            Próximos agendamentos
          </h2>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-bold text-slate-700">
                    Cliente
                  </th>
                  <th className="text-left py-3 px-4 font-bold text-slate-700">
                    Serviço
                  </th>
                  <th className="text-left py-3 px-4 font-bold text-slate-700">
                    Horário
                  </th>
                  <th className="text-left py-3 px-4 font-bold text-slate-700">
                    Profissional
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { client: 'João Silva', service: 'Corte', time: '10:30', professional: 'Carlos' },
                  { client: 'Maria Santos', service: 'Barba + Cabelo', time: '11:15', professional: 'Pedro' },
                  { client: 'Lucas Costa', service: 'Hidratação', time: '12:00', professional: 'Carlos' },
                ].map((appointment) => (
                  <tr key={appointment.client} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-900">{appointment.client}</td>
                    <td className="py-3 px-4 text-slate-600">{appointment.service}</td>
                    <td className="py-3 px-4 text-slate-600">{appointment.time}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {appointment.professional}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
