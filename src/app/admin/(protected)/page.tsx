import type { Metadata } from "next";
import Link from "next/link";
import AdminHeader from "@/components/admin/admin-header";
import AdminStats from "@/components/admin/admin-stats";
import AdminPaymentDonut from "@/components/admin/admin-payment-donut";
import AdminActivityTimeline from "@/components/admin/admin-activity-timeline";
import RecentAdminOrders from "@/components/admin/recent-admin-orders";
import AdminHoneyBg from "@/components/admin/admin-honey-bg";
import { getAdminStats, listOrders } from "@/lib/admin/orders";

export const metadata: Metadata = {
  title: "Dashboard — Honey Admin",
  robots: { index: false, follow: false },
};

export const revalidate = 0;

const SL: React.CSSProperties = {
  fontSize: "0.62rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#B87514",
  marginBottom: "0.625rem",
};

export default async function AdminDashboardPage() {
  const [stats, { orders: recentOrders }] = await Promise.all([
    getAdminStats(),
    listOrders({ limit: 8 }),
  ]);

  const attentionCount = stats.awaitingPaymentOrders + stats.pendingOrders;

  return (
    <>
      <AdminHeader
        title="Dashboard"
        subtitle={new Date().toLocaleDateString("es-MX", { dateStyle: "long" })}
      />

      <main className="admin-page-main">
        {/* Métricas */}
        <section className="admin-fade-up">
          <p style={SL}>Resumen del día</p>
          <AdminStats stats={stats} />
        </section>

        <div className="admin-dashboard-grid admin-fade-up-1">
          <section>
            <p style={SL}>Pedidos recientes</p>
            <RecentAdminOrders orders={recentOrders} />
          </section>

          <div className="admin-dashboard-side">
            {/* Donut */}
            <section>
              <p style={SL}>Métodos de pago</p>
              <div className="admin-card" style={{ padding: "1rem 1.125rem" }}>
                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2C1E11", marginBottom: "0.875rem" }}>
                  Distribución de pedidos
                </p>
                <AdminPaymentDonut stats={stats} />
              </div>
            </section>

            {attentionCount > 0 && (
              <section>
                <p style={SL}>Atención requerida</p>
                <div
                  className="admin-card"
                  style={{
                    padding: "0.95rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.875rem",
                    borderLeft: "3px solid rgba(245,158,11,0.5)",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#2C1E11" }}>
                      {stats.awaitingPaymentOrders} pago{stats.awaitingPaymentOrders !== 1 ? "s" : ""} requieren revisión
                    </p>
                    <p style={{ fontSize: "0.76rem", color: "#6F5635", lineHeight: 1.45 }}>
                      {stats.pendingOrders} pedido{stats.pendingOrders !== 1 ? "s" : ""} por atender.
                    </p>
                  </div>
                  <Link
                    href="/admin/orders"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0.45rem 0.7rem",
                      borderRadius: "0.5rem",
                      border: "1px solid rgba(184,117,20,0.22)",
                      background: "rgba(255,255,255,0.58)",
                      color: "#B87514",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    Ver pedidos
                  </Link>
                </div>
              </section>
            )}

            {/* Quick notes */}
            <section>
              <p style={SL}>Notas operativas</p>
              <div
                className="admin-card"
                style={{ padding: "1rem 1.125rem", position: "relative", overflow: "hidden" }}
              >
                <AdminHoneyBg opacity={0.045} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#B87514", marginBottom: "0.75rem" }}>
                    Recordatorios
                  </p>
                  {[
                    "Entregas en CDMX: 24–48 h hábiles.",
                    "Confirma pagos antes de despachar.",
                    "Productos artesanales, manejo cuidadoso.",
                    "Actualiza el estado al hacer envíos.",
                  ].map((note, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex", gap: "0.5rem", alignItems: "flex-start",
                        padding: "0.3rem 0",
                        borderBottom: i < 3 ? "1px solid rgba(184,117,20,0.07)" : "none",
                      }}
                    >
                      <span style={{ color: "#D4AF37", fontSize: "0.68rem", marginTop: "3px", flexShrink: 0 }}>◆</span>
                      <p style={{ fontSize: "0.78rem", color: "#6F5635", lineHeight: 1.5 }}>{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <p style={SL}>Actividad reciente</p>
              <div className="admin-card" style={{ padding: "0.875rem 1rem" }}>
                <AdminActivityTimeline orders={recentOrders} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
