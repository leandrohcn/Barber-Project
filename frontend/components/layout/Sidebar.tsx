'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Scissors, LayoutDashboard, Calendar, Package, Users, LogOut, Settings, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/useAuth';
import { api } from '@/lib/api';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    api.logout();
  };

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

      {/* Footer - User Menu */}
      <div className="px-4 py-6 border-t border-slate-800 relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <div className="flex flex-col items-start flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.email || 'Usuário'}
            </p>
            <p className="text-xs text-slate-400">
              {user?.role === 'OWNER' ? 'Administrador' : 'Funcionário'}
            </p>
          </div>
          <ChevronDown
            className={`w-5 h-5 flex-shrink-0 transition-transform ${
              showUserMenu ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {showUserMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 rounded-lg border border-slate-700 shadow-lg overflow-hidden z-10">
            <Link
              href="/configuracoes"
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm"
            >
              <Settings className="w-4 h-4" />
              <span>Configurações</span>
            </Link>
            <button
              onClick={() => {
                setShowUserMenu(false);
                setShowLogoutConfirm(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-t border-slate-700 text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        )}

        {/* Logout Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showLogoutConfirm}
          title="Desconectar?"
          message="Você será desconectado da sua conta. Deseja continuar?"
          confirmText="Desconectar"
          cancelText="Cancelar"
          isDangerous={true}
          isLoading={isLoggingOut}
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      </div>
    </aside>
  );
}
