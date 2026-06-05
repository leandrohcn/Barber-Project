'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

interface Funcionario {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAtivo: boolean;
}

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load funcionarios
  useEffect(() => {
    loadFuncionarios();
  }, []);

  const loadFuncionarios = async () => {
    try {
      setLoading(true);
      const response = await api.getFuncionarios();
      setFuncionarios(response.data.data || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (funcionario?: Funcionario) => {
    if (funcionario) {
      setEditingId(funcionario.id);
      setFormData({
        name: funcionario.name,
        email: funcionario.email,
        phone: funcionario.phone || '',
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', email: '', phone: '' });
    }
    setFormError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '' });
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Nome é obrigatório');
      return;
    }

    if (!formData.email.trim()) {
      setFormError('Email é obrigatório');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingId) {
        // Editar funcionário
        await api.updateFuncionario(editingId, {
          name: formData.name,
          phone: formData.phone || undefined,
        });
      } else {
        // Criar novo funcionário
        await api.createFuncionario({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
        });
      }

      handleCloseModal();
      await loadFuncionarios();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Erro ao salvar funcionário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('Desativar este funcionário?')) return;

    try {
      await api.deactivateFuncionario(id);
      await loadFuncionarios();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao desativar funcionário');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deletar este funcionário? Esta ação não pode ser desfeita.')) return;

    try {
      await api.deleteFuncionario(id);
      await loadFuncionarios();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao deletar funcionário');
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Funcionários</h1>
          <p className="text-slate-500">Gerenciar equipe da sua organização</p>
        </div>
        <Button
          variant="primary"
          className="gap-2"
          onClick={() => handleOpenModal()}
        >
          <Plus className="w-4 h-4" />
          Adicionar Funcionário
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabela de Funcionários */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {funcionarios.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-lg font-medium">Nenhum funcionário cadastrado</p>
            <p className="text-sm mt-1">Clique em "Adicionar Funcionário" para começar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Telefone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {funcionarios.map((funcionario) => (
                  <tr key={funcionario.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {funcionario.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {funcionario.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {funcionario.phone || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          funcionario.isAtivo
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {funcionario.isAtivo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(funcionario)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeactivate(funcionario.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                          title={funcionario.isAtivo ? 'Desativar' : 'Ativar'}
                        >
                          {funcionario.isAtivo ? '⊘' : '✓'}
                        </button>
                        <button
                          onClick={() => handleDelete(funcionario.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors text-slate-600 hover:text-red-600"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? 'Editar Funcionário' : 'Adicionar Funcionário'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome"
                type="text"
                placeholder="João Silva"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="Email"
                type="email"
                placeholder="joao@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={!!editingId}
              />

              <Input
                label="Telefone (Opcional)"
                type="tel"
                placeholder="(11) 9 9999-9999"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  isLoading={isSubmitting}
                >
                  {editingId ? 'Salvar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
