'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatDate, formatTime } from '@/lib/utils';
import { Filter, ChevronDown } from 'lucide-react';

interface Agendamento {
  id: string;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone: string;
  funcionarioNome?: string;
  service: string;
  date: string;
  status: string;
}

type StatusFilter = 'TODOS' | 'PENDENTE' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO';

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [filteredAgendamentos, setFilteredAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('TODOS');

  // Load agendamentos
  useEffect(() => {
    loadAgendamentos();
  }, []);

  // Filter agendamentos quando status mudar
  useEffect(() => {
    if (statusFilter === 'TODOS') {
      setFilteredAgendamentos(agendamentos);
    } else {
      setFilteredAgendamentos(
        agendamentos.filter((a) => a.status === statusFilter)
      );
    }
  }, [statusFilter, agendamentos]);

  const loadAgendamentos = async () => {
    try {
      setLoading(true);
      const response = await api.getAgendamentos('');
      const agendamentos = response.data.agendamentos || response.data;

      // Transformar para incluir nome do funcionário
      const transformed = agendamentos.map((a: any) => ({
        id: a.id,
        clienteNome: a.clienteNome,
        clienteEmail: a.clienteEmail,
        clienteTelefone: a.clienteTelefone,
        funcionarioNome: a.funcionarios?.name || 'N/A',
        service: a.catalogs?.name || 'N/A',
        date: a.date,
        status: a.status,
      }));

      setAgendamentos(transformed);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDENTE: 'bg-yellow-100 text-yellow-700',
      CONFIRMADO: 'bg-blue-100 text-blue-700',
      CONCLUIDO: 'bg-green-100 text-green-700',
      CANCELADO: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-slate-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Agendamentos</h1>
        <p className="text-slate-500">Visualizar e gerenciar agendamentos da organização</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-700">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['TODOS', 'PENDENTE', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO'] as StatusFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status === 'TODOS' ? 'Todos' : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de Agendamentos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredAgendamentos.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-lg font-medium">Nenhum agendamento encontrado</p>
            <p className="text-sm mt-1">
              {statusFilter === 'TODOS'
                ? 'Agendamentos aparecerão aqui'
                : `Nenhum agendamento com status "${statusFilter.toLowerCase()}"`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Serviço
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Funcionário
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Data/Hora
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Contato
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAgendamentos.map((agendamento) => (
                  <tr key={agendamento.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {agendamento.clienteNome}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {agendamento.service}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {agendamento.funcionarioNome}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div>
                        <p className="font-medium">
                          {formatTime(agendamento.date)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(agendamento.date)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          agendamento.status
                        )}`}
                      >
                        {agendamento.status.charAt(0) +
                          agendamento.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-slate-600">📧 {agendamento.clienteEmail}</p>
                        <p className="text-slate-600">📱 {agendamento.clienteTelefone}</p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['PENDENTE', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO'] as const).map((status) => {
          const count = agendamentos.filter((a) => a.status === status).length;
          return (
            <div
              key={status}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-4"
            >
              <p className="text-slate-600 text-sm">{status.charAt(0) + status.slice(1).toLowerCase()}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
