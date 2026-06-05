'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Phone } from 'lucide-react';

export default function CompleteProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        // Check if profile is already complete by trying to load dashboard
        await api.getStaffDashboard();
        // If successful, redirect to owner dashboard
        router.push('/owner/dashboard');
      } catch {
        // If fails, profile is incomplete, show the form
        setIsCheckingProfile(false);
      }
    };

    checkProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    setIsLoading(true);

    try {
      await api.completeStaffProfile({
        name,
        phone: phone || undefined,
      });

      // Redirecionar para o owner dashboard
      router.push('/owner/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao completar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <p className="text-slate-500">Verificando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Complete seu Perfil
          </h1>
          <p className="text-slate-500 mb-8">
            Precisamos de alguns dados para começar
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              icon={User}
              label="Nome Completo"
              type="text"
              placeholder="Seu nome"
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Continuar para Dashboard
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
