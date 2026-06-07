'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, Phone, Scissors, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';

interface InviteData {
  email: string;
  organizationId: string;
  organizationName: string;
  valid: boolean;
}

export default function RegisterInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('invite');

  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  // Validar convite
  useEffect(() => {
    const validateInvite = async () => {
      if (!inviteToken) {
        setError('Convite inválido. Link não encontrado.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.validateInvite(inviteToken);
        setInviteData({
          ...response.data,
          valid: true,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Convite inválido ou expirado');
      } finally {
        setLoading(false);
      }
    };

    validateInvite();
  }, [inviteToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Nome é obrigatório');
      return;
    }

    if (password.length < 6) {
      setFormError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!inviteToken) {
        throw new Error('Token de convite não encontrado');
      }

      await api.registerWithInvite({
        inviteToken,
        password,
        name,
        phone: phone || undefined,
      });

      // Redirecionar para dashboard
      router.push('/staff/dashboard');
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Erro ao registrar');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-slate-300">Validando convite...</div>
      </main>
    );
  }

  if (error || !inviteData) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 text-center mb-4">
              Convite Inválido
            </h1>
            <p className="text-slate-600 text-center mb-6">
              {error || 'Este convite não é válido ou expirou.'}
            </p>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => router.push('/register')}
            >
              Criar Nova Conta
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Scissors className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Bem-vindo!
          </h1>
          <p className="text-slate-500 mb-2">
            Você foi convidado para:
          </p>
          <p className="text-lg font-semibold text-blue-600 mb-6">
            {inviteData.organizationName}
          </p>

          {formError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {formError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              icon={Mail}
              label="Email"
              type="email"
              value={inviteData.email}
              disabled
              className="bg-slate-50 cursor-not-allowed"
            />

            <Input
              icon={User}
              label="Nome Completo"
              type="text"
              placeholder="João Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              icon={Phone}
              label="Telefone (Opcional)"
              type="tel"
              placeholder="(11) 9 9999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Input
              icon={Lock}
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
            >
              Aceitar Convite
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-slate-500 text-sm mt-6">
            Já tem conta?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-blue-600 font-medium hover:underline"
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
