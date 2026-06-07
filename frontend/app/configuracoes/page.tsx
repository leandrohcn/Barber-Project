'use client';

import { useAuth } from '@/lib/useAuth';

export default function ConfiguracoesPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
        <p className="text-slate-500">Gerenciar configurações da sua conta</p>
      </div>

      {/* Informações da Conta */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Informações da Conta</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tipo de Conta
            </label>
            <input
              type="text"
              value={user?.role === 'OWNER' ? 'Administrador' : 'Funcionário'}
              disabled
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              ID da Organização
            </label>
            <input
              type="text"
              value={user?.organizationId || ''}
              disabled
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Em Desenvolvimento */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <p className="text-blue-800 font-medium">Mais opções em breve</p>
        <p className="text-blue-700 text-sm mt-1">
          Alteração de senha, preferências de notificação e mais configurações estarão disponíveis em breve.
        </p>
      </div>
    </div>
  );
}
