import { AdminLayout } from '@/components/layout/AdminLayout';

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
