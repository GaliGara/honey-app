import type { Metadata } from "next";
import AdminHeader from "@/components/admin/admin-header";
import OrdersTable from "@/components/admin/orders-table";
import OrdersFilters from "@/components/admin/orders-filters";
import AdminSummaryBar from "@/components/admin/admin-summary-bar";
import { listOrders, getAdminStats } from "@/lib/admin/orders";
import type { OrderStatus, PaymentStatus } from "@/types/admin";

export const metadata: Metadata = {
  title: "Pedidos — Honey Admin",
  robots: { index: false, follow: false },
};

export const revalidate = 0;

interface SearchParams {
  status?: string;
  payment_status?: string;
  search?: string;
  page?: string;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);

  const [{ orders, total }, stats] = await Promise.all([
    listOrders({
      status: params.status as OrderStatus | undefined,
      paymentStatus: params.payment_status as PaymentStatus | undefined,
      search: params.search,
      page,
      limit: 20,
    }),
    getAdminStats(),
  ]);

  return (
    <>
      <AdminHeader
        title="Pedidos"
        subtitle={`${total} pedido${total !== 1 ? "s" : ""} en total`}
      />

      <main className="admin-page-main admin-page-main--compact">
        {/* Summary bar */}
        <AdminSummaryBar stats={stats} total={stats.totalOrders} />

        {/* Filters toolbar */}
        <OrdersFilters
          currentStatus={params.status}
          currentPaymentStatus={params.payment_status}
          currentSearch={params.search}
        />

        {/* Table / cards */}
        <OrdersTable orders={orders} total={total} currentPage={page} />
      </main>
    </>
  );
}
