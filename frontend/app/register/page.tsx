'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Store, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [organizationName, setOrganizationName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await api.register({
        organizationName,
        name,
        email,
        password
      });
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Criar Organização
          </h1>
          <p className="text-slate-500 mb-8">
            Configure sua barbearia ou salão
          </p>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              icon={Store}
              label="Nome da Organização"
              type="text"
              placeholder="Minha Barbearia"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
            />

            <Input
              icon={User}
              label="Seu Nome"
              type="text"
              placeholder="João Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              icon={Mail}
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              isLoading={isLoading}
            >
              Criar Organização
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-slate-500 text-sm mt-6">
            Já tem conta?{' '}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Entrar aqui
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
