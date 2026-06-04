import { AdminLayout } from '@/components/layout/AdminLayout';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
