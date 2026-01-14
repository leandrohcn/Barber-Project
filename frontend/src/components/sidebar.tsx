import Link from 'next/link';
import { LayoutDashboard, Calendar, Scissors, Users, LogOut } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-slate-800">
        <h1 className="text-xl font-bold"> JC Stylos ✂️</h1>
      </div>

      {/* Menu */}
      <nav className="mt-6 flex flex-col gap-2 px-4">
        <Link href="/dashboard" className="flex items-center gap-3 rounded px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white">
          <LayoutDashboard size={20} />
          <span>Visão Geral</span>
        </Link>

        <Link href="/dashboard/catalogos" className="flex items-center gap-3 rounded px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white">
          <Scissors size={20} />
          <span>Serviços</span>
        </Link>

        <Link href="/dashboard/agenda" className="flex items-center gap-3 rounded px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white">
          <Calendar size={20} />
          <span>Agenda</span>
        </Link>
      </nav>

      {/* Botão Sair */}
      <div className="absolute bottom-4 left-0 w-full px-4">
        <button className="flex w-full items-center gap-3 rounded px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}