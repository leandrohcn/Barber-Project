'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/src/services/api'; 
import Cookies from 'js-cookie';
import { Lock, Mail, Scissors } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;

      Cookies.set('barber_token', access_token, { expires: 1 });
      Cookies.set('barber_user', JSON.stringify(user), { expires: 1 });

      router.push('/dashboard'); 
    } catch (err) {
      console.error(err);
      setError('Email ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm rounded-lg bg-slate-800 p-8 shadow-lg">
        
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
            <Scissors className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Barber Admin</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          
          <Input 
            label="Email" 
            type="email" 
            icon={Mail} 
            placeholder="admin@barber.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input 
            label="Senha" 
            type="password" 
            icon={Lock} 
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <Button type="submit" isLoading={loading}>
            Entrar
          </Button>

        </form>
      </div>
    </div>
  );
}