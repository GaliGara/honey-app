import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  ADMIN_COOKIE,
  getSessionCookieOptions,
} from "@/lib/admin/auth";

const LoginSchema = z.object({
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Contraseña requerida" },
        { status: 400 }
      );
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminToken = process.env.ADMIN_SESSION_TOKEN;

    if (!adminPassword || !adminToken) {
      console.error("[admin/login] ADMIN_PASSWORD o ADMIN_SESSION_TOKEN no configurados");
      return NextResponse.json(
        { ok: false, message: "Configuración del servidor incompleta" },
        { status: 500 }
      );
    }

    if (parsed.data.password !== adminPassword) {
      // Delay mínimo para mitigar timing attacks
      await new Promise((r) => setTimeout(r, 200));
      return NextResponse.json(
        { ok: false, message: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(getSessionCookieOptions(adminToken));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
