import { AdminLayout } from '@/components/layout/AdminLayout';

export default function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
