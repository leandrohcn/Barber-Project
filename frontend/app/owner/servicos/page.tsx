'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

interface Servico {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  isAtivo?: boolean;
}

export default function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '30',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load servicos
  useEffect(() => {
    loadServicos();
  }, []);

  const loadServicos = async () => {
    try {
      setLoading(true);
      const response = await api.getCatalogs('');
      setServicos(response.data.data || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (servico?: Servico) => {
    if (servico) {
      setEditingId(servico.id);
      setFormData({
        name: servico.name,
        description: servico.description || '',
        price: servico.price.toString(),
        duration: servico.duration.toString(),
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', duration: '30' });
    }
    setFormError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', duration: '30' });
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Nome do serviço é obrigatório');
      return;
    }

    if (!formData.price) {
      setFormError('Preço é obrigatório');
      return;
    }

    if (!formData.duration) {
      setFormError('Duração é obrigatória');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        name: formData.name,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
      };

      if (editingId) {
        // Editar serviço
        await api.updateCatalog(editingId, data);
      } else {
        // Criar novo serviço
        await api.createCatalog(data);
      }

      handleCloseModal();
      await loadServicos();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Erro ao salvar serviço');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deletar este serviço? Esta ação não pode ser desfeita.')) return;

    try {
      await api.deleteCatalog(id);
      await loadServicos();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao deletar serviço');
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
          <h1 className="text-3xl font-bold text-slate-900">Serviços</h1>
          <p className="text-slate-500">Gerenciar catálogo de serviços</p>
        </div>
        <Button
          variant="primary"
          className="gap-2"
          onClick={() => handleOpenModal()}
        >
          <Plus className="w-4 h-4" />
          Adicionar Serviço
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Grid de Serviços */}
      {servicos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
          <p className="text-lg font-medium">Nenhum serviço cadastrado</p>
          <p className="text-sm mt-1">Clique em "Adicionar Serviço" para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicos.map((servico) => (
            <div
              key={servico.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{servico.name}</h3>
                  {servico.description && (
                    <p className="text-sm text-slate-600 mt-1">{servico.description}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Preço:</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(servico.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Duração:</span>
                  <span className="font-bold text-slate-900">{servico.duration} min</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleOpenModal(servico)}
                  className="flex-1 p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(servico.id)}
                  className="flex-1 p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600 hover:text-red-700 flex items-center justify-center gap-2"
                  title="Deletar"
                >
                  <Trash2 className="w-4 h-4" />
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? 'Editar Serviço' : 'Adicionar Serviço'}
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
                label="Nome do Serviço"
                type="text"
                placeholder="Corte de cabelo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descrição (Opcional)
                </label>
                <textarea
                  placeholder="Descrição do serviço"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <Input
                label="Preço (R$)"
                type="number"
                placeholder="50.00"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />

              <Input
                label="Duração (minutos)"
                type="number"
                placeholder="30"
                min="15"
                step="15"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
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
