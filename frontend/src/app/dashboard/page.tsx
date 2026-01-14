'use client';

import { useEffect, useState } from 'react';
import { DollarSign, CalendarX, TrendingUp, Users } from 'lucide-react';

export default function DashboardHome() {
  const [metrics, setMetrics] = useState({
    agendamentos: 0,
    cancelamentos: 0,
    faturamentoEsperado: 0,
    faturamentoReal: 0
  });

  useEffect(() => {
    // Busca os dados do backend
    fetch('http://localhost:3001/dashboard/metrica')
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Visão Geral</h1>
      <p className="text-slate-500 mb-8">Resumo das atividades de hoje.</p>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Agendamentos Totais */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Agendamentos</p>
            <h3 className="text-2xl font-bold text-slate-800">{metrics.agendamentos}</h3>
          </div>
        </div>

        {/* Card 2: Faturamento Esperado */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Faturamento Previsto</p>
            <h3 className="text-2xl font-bold text-slate-800">
              R$ {metrics.faturamentoEsperado.toFixed(2)}
            </h3>
          </div>
        </div>

        {/* Card 3: Faturamento Real (Caixa) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-full">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Em Caixa (Real)</p>
            <h3 className="text-2xl font-bold text-emerald-700">
              R$ {metrics.faturamentoReal.toFixed(2)}
            </h3>
          </div>
        </div>

        {/* Card 4: Cancelamentos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-full">
            <CalendarX size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Cancelamentos</p>
            <h3 className="text-2xl font-bold text-red-600">{metrics.cancelamentos}</h3>
          </div>
        </div>

      </div>

      {/* Espaço para gráficos ou lista de próximos clientes */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-64 flex items-center justify-center text-slate-400">
        <p>Espaço reservado para Gráfico Semanal (Próximos passos)</p>
      </div>
    </div>
  );
}