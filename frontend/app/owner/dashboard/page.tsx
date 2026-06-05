'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { Calendar, DollarSign, Users, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OwnerDashboard {
  metricas: {
    faturamentoEsperado: number;
    faturamentoReal: number;
    cancelamentos: number;
    agendamentos: number;
  };
  funcionarios: Array<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    isAtivo: boolean;
  }>;
  catalogs: Array<{
    id: string;
    name: string;
    price: number;
    duration: number;
  }>;
  agendamentosHoje: Array<{
    id: string;
    clienteNome: string;
    clienteEmail: string;
    clienteTelefone: string;
    service: string;
    date: string;
    status: string;
    funcionarioNome: string;
  }>;
}

export default function OwnerDashboardPage() {
  const [dashboard, setDashboard] = useState<OwnerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        // Carregar todas as informações em paralelo
        const [metricas, funcionarios, catalogs, agendamentos] = await Promise.all([
          api.getOwnerDashboard(),
          api.getFuncionarios(),
          api.getCatalogs(''),
          api.getAgendamentos(''),
        ]);

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const amanha = new Date(hoje);
        amanha.setDate(amanha.getDate() + 1);

        // Filtrar agendamentos de hoje
        const agendamentosHoje = (agendamentos.data.agendamentos || []).filter(
          (a: any) => {
            const agDate = new Date(a.date);
            return agDate >= hoje && agDate < amanha;
          }
        );

        setDashboard({
          metricas: metricas.data,
          funcionarios: funcionarios.data.data || funcionarios.data,
          catalogs: catalogs.data.data || catalogs.data,
          agendamentosHoje: agendamentosHoje,
        });
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
        <p className="text-slate-500">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Painel de Controle</h1>
        <p className="text-slate-500">Visão geral da sua organização</p>
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
            {dashboard.metricas.agendamentos}
          </p>
        </div>

        {/* Faturamento Real */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-slate-500 text-sm">Faturamento Real</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {formatCurrency(dashboard.metricas.faturamentoReal)}
          </p>
        </div>

        {/* Funcionários */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-slate-500 text-sm">Funcionários</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {dashboard.funcionarios.length}
          </p>
        </div>

        {/* Serviços */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-slate-500 text-sm">Serviços</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {dashboard.catalogs.length}
          </p>
        </div>
      </div>

      {/* Seção de Agendamentos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Agendamentos de Hoje</h2>
          <Button variant="primary" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </Button>
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
                      <span className="ml-auto">👤 {agendamento.funcionarioNome}</span>
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

      {/* Grid de Funcionários e Serviços */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funcionários */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Funcionários</h2>
            <Button variant="primary" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>

          <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
            {dashboard.funcionarios.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                Nenhum funcionário cadastrado
              </div>
            ) : (
              dashboard.funcionarios.map((funcionario) => (
                <div key={funcionario.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{funcionario.name}</p>
                      <p className="text-sm text-slate-500">{funcionario.email}</p>
                      {funcionario.phone && (
                        <p className="text-sm text-slate-500">{funcionario.phone}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          funcionario.isAtivo
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {funcionario.isAtivo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Serviços */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Serviços</h2>
            <Button variant="primary" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>

          <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
            {dashboard.catalogs.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                Nenhum serviço cadastrado
              </div>
            ) : (
              dashboard.catalogs.map((catalog) => (
                <div key={catalog.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{catalog.name}</p>
                      <p className="text-sm text-slate-500">
                        {catalog.duration} min • {formatCurrency(catalog.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
