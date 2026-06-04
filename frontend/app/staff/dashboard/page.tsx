'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';

interface StaffDashboard {
  funcionario: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  metricas: {
    agendamentosHoje: number;
    faturamentoUltimos30Dias: number;
    clientesUnicos: number;
    agendamentosConfirmados: number;
  };
  agendamentosHoje: Array<{
    id: string;
    clienteNome: string;
    clienteEmail: string;
    clienteTelefone: string;
    service: string;
    date: string;
    status: string;
  }>;
}

export default function StaffDashboardPage() {
  const [dashboard, setDashboard] = useState<StaffDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const response = await api.getStaffDashboard();
        setDashboard(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-slate-500">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Nenhum dados disponível</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Visão Geral</h1>
        <p className="text-slate-500">Resumo de suas atividades</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Agendamentos Hoje */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-slate-500 text-sm">Agendamentos Hoje</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {dashboard.metricas.agendamentosHoje}
          </p>
        </div>

        {/* Faturamento */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-slate-500 text-sm">Faturamento (30 dias)</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {formatCurrency(dashboard.metricas.faturamentoUltimos30Dias)}
          </p>
        </div>

        {/* Clientes Únicos */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-slate-500 text-sm">Clientes Únicos</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {dashboard.metricas.clientesUnicos}
          </p>
        </div>

        {/* Agendamentos Confirmados */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-slate-500 text-sm">Confirmados (30 dias)</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {dashboard.metricas.agendamentosConfirmados}
          </p>
        </div>
      </div>

      {/* Agendamentos de Hoje */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Agendamentos de Hoje</h2>
        </div>

        <div className="divide-y divide-slate-200">
          {dashboard.agendamentosHoje.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              Nenhum agendamento para hoje
            </div>
          ) : (
            dashboard.agendamentosHoje.map((agendamento) => (
              <div key={agendamento.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{agendamento.clienteNome}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {agendamento.service}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                      <span>📧 {agendamento.clienteEmail}</span>
                      <span>📱 {agendamento.clienteTelefone}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      {formatTime(agendamento.date)}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {formatDate(agendamento.date)}
                    </p>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {agendamento.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
