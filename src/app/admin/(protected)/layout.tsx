import { requireAdminAuth } from "@/lib/admin/auth";
import AdminShell from "@/components/admin/admin-shell";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirige a /admin/login si la sesión no es válida
  await requireAdminAuth();

  return <AdminShell>{children}</AdminShell>;
}
