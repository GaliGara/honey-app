import type { Metadata } from "next";
import UnifiedLogin from "@/components/auth/unified-login";

export const metadata: Metadata = {
  title: "Acceso — Honey",
  description: "Entra a tu cuenta o al panel de administración de Honey.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <UnifiedLogin />;
}
