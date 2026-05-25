import type { Metadata } from "next";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin — Honey",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // Si ya tiene sesión válida, llevar al dashboard
  const authenticated = await isAdminAuthenticated();
  if (authenticated) redirect("/admin");

  return (
    <div
      className="warm-radial-bg"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      {/* Card */}
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: "1.5rem",
          padding: "2.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          {/* Honey badge */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(184,117,20,0.12) 100%)",
              border: "1.5px solid rgba(212,175,55,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#2C1E11",
              lineHeight: 1.2,
            }}
          >
            Panel de administración
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6F5635",
              marginTop: "0.5rem",
            }}
          >
            Honey — Gestión de pedidos
          </p>
        </div>

        <AdminLoginForm />
      </div>
    </div>
  );
}
