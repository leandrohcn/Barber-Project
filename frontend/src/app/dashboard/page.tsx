'use client'; 

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function DashboardHome() {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const userCookie = Cookies.get('barber_user');
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    }
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800">
        Olá, {user?.name || 'Barbeiro'}! 👋
      </h1>
      <p className="mt-2 text-slate-600">
        Bem-vindo ao seu painel de gerenciamento.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-blue-500">
          <h3 className="font-bold text-gray-500">Agendamentos Hoje</h3>
          <p className="text-2xl font-bold text-slate-800">0</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-green-500">
          <h3 className="font-bold text-gray-500">Faturamento</h3>
          <p className="text-2xl font-bold text-slate-800">R$ 0,00</p>
        </div>
      </div>
    </div>
  );
}