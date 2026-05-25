import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { getOrder, updateOrder } from "@/lib/admin/orders";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, message: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const order = await getOrder(id);
    if (!order) {
      return NextResponse.json({ ok: false, message: "Pedido no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, order });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

const PatchSchema = z.object({
  status: z
    .enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"])
    .optional(),
  paymentStatus: z
    .enum([
      "pending_payment",
      "pending_transfer",
      "pending_deposit",
      "pending_cash_payment",
      "paid",
      "payment_failed",
      "cancelled",
      "refunded",
    ])
    .optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ ok: false, message: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ ok: false, message: "ID requerido" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "JSON inválido" }, { status: 400 });
  }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Datos inválidos", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (!parsed.data.status && !parsed.data.paymentStatus) {
    return NextResponse.json(
      { ok: false, message: "Debes proporcionar status o paymentStatus" },
      { status: 400 }
    );
  }

  try {
    await updateOrder(id, {
      status: parsed.data.status,
      paymentStatus: parsed.data.paymentStatus,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
