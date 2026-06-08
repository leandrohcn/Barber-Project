'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import { useOrganization } from '@/lib/OrganizationContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, AlertCircle, Scissors, Sparkles, Crown, Star, Heart } from 'lucide-react';

// Ícones disponíveis
const ICON_OPTIONS = [
  { name: 'scissors', label: 'Tesoura', icon: Scissors },
  { name: 'sparkles', label: 'Brilho', icon: Sparkles },
  { name: 'crown', label: 'Coroa', icon: Crown },
  { name: 'star', label: 'Estrela', icon: Star },
  { name: 'heart', label: 'Coração', icon: Heart },
];

export default function OwnerConfiguracoesPage() {
  const { user } = useAuth();
  const { organization, loading, refreshOrganization } = useOrganization();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    logo: 'scissors',
  });

  // Sincronizar formData com organização do contexto
  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        logo: organization.logo || 'scissors',
      });
    }
  }, [organization]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Nome da organização é obrigatório');
      return;
    }

    if (!user?.organizationId) {
      setError('Organização não encontrada');
      return;
    }

    setIsSaving(true);

    try {
      await api.updateOrganization(user.organizationId, {
        name: formData.name,
        logo: formData.logo,
      });

      // Atualizar contexto para o Sidebar refletir as mudanças
      await refreshOrganization();

      setSuccess('Configurações salvas com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-500">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configurações da Organização</h1>
        <p className="text-slate-500">Personalize sua barbearia ou salão</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          ✅ {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Informações Básicas</h2>

          <div className="space-y-4">
            <Input
              label="Nome da Organização"
              type="text"
              placeholder="Minha Barbearia"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Ícone da Organização
              </label>
              <div className="grid grid-cols-5 gap-3">
                {ICON_OPTIONS.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = formData.logo === option.name;
                  return (
                    <button
                      key={option.name}
                      onClick={() => setFormData({ ...formData, logo: option.name })}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      type="button"
                      title={option.label}
                    >
                      <IconComponent className="w-6 h-6 text-slate-700" />
                      <span className="text-xs text-slate-600 text-center">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Botão Salvar */}
        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="gap-2 flex-1"
            isLoading={isSaving}
          >
            <Save className="w-4 h-4" />
            Salvar Configurações
          </Button>
        </div>
      </form>
    </div>
  );
}
