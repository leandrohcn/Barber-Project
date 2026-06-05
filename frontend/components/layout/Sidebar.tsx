'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scissors, LayoutDashboard, Calendar, Package, Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/useAuth';

export function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Determinar rotas baseado no role
  const dashboardHref = user?.role === 'OWNER' ? '/owner/dashboard' : '/staff/dashboard';

  const navItems = [
    { href: dashboardHref, label: 'Visão Geral', icon: LayoutDashboard },
    ...(user?.role === 'OWNER'
      ? [
          { href: '/owner/funcionarios', label: 'Funcionários', icon: Users },
          { href: '/owner/servicos', label: 'Serviços', icon: Package },
          { href: '/owner/agendamentos', label: 'Agendamentos', icon: Calendar },
        ]
      : [
          { href: '/staff/agendamentos', label: 'Meus Agendamentos', icon: Calendar },
          { href: '/staff/disponibilidade', label: 'Disponibilidade', icon: Package },
        ]),
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <Scissors className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold">Agenda</h1>
          <p className="text-slate-400 text-xs">Sistema de Agendamentos</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              pathname === href
                ? 'bg-slate-800 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-6 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
