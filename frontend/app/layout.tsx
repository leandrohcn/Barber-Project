import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agenda - Sistema de Agendamentos',
  description: 'Plataforma de agendamentos para barbearias e salões',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-100">
        {children}
      </body>
    </html>
  );
}
