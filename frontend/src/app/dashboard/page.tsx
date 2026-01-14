'use client'; 

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Calendar, DollarSign, Users } from 'lucide-react';

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
        Aqui está o resumo do seu dia.
      </p>

      {/* Cards de Resumo */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1 */}
        <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Agendamentos Hoje</p>
              <p className="text-2xl font-bold text-slate-800">0</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-green-500">
           <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Faturamento Dia</p>
              <p className="text-2xl font-bold text-slate-800">R$ 0,00</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-lg bg-white p-6 shadow-md border-l-4 border-purple-500">
           <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Clientes Novos</p>
              <p className="text-2xl font-bold text-slate-800">0</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}