'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Copy, X, CheckCircle } from 'lucide-react';

interface GeneratedInvite {
  email: string;
  inviteLink: string;
  token: string;
}

export default function ConvitesPage() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedInvite, setGeneratedInvite] = useState<GeneratedInvite | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  const handleGenerateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email é obrigatório');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.generateInvite(email);
      setGeneratedInvite(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao gerar convite');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    } catch {
      setError('Erro ao copiar link');
    }
  };

  const handleNewInvite = () => {
    setEmail('');
    setGeneratedInvite(null);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEmail('');
    setError('');
    setGeneratedInvite(null);
    setCopiedToken(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Convites</h1>
          <p className="text-slate-500">Convide funcionários para sua organização</p>
        </div>
        <Button
          variant="primary"
          className="gap-2"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4" />
          Gerar Convite
        </Button>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Como funciona:</h3>
        <ol className="text-blue-800 text-sm space-y-1 list-decimal list-inside">
          <li>Preencha o email do funcionário</li>
          <li>Clique em "Gerar Convite"</li>
          <li>Copie o link e compartilhe com o funcionário</li>
          <li>O funcionário clica no link e cria sua conta</li>
          <li>Pronto! O funcionário pode acessar o sistema</li>
        </ol>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {generatedInvite ? 'Convite Gerado' : 'Gerar Convite'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {!generatedInvite ? (
              <>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleGenerateInvite} className="space-y-4">
                  <Input
                    label="Email do Funcionário"
                    type="email"
                    placeholder="funcionario@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      Gerar Convite
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="mb-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-slate-600 mb-2">Convite gerado com sucesso!</p>
                  <p className="text-sm text-slate-500">
                    Email: <strong>{generatedInvite.email}</strong>
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Link de Convite:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={generatedInvite.inviteLink}
                      readOnly
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-mono text-slate-600"
                    />
                    <button
                      onClick={() => handleCopyLink(generatedInvite.inviteLink)}
                      className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center gap-2 ${
                        copiedToken
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <Copy className="w-4 h-4" />
                      {copiedToken ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-4">
                  ⏰ Este convite expira em 7 dias
                </p>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={handleNewInvite}
                  >
                    Novo Convite
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    className="flex-1"
                    onClick={handleCloseModal}
                  >
                    Fechar
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
