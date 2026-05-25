/**
 * Helpers de autenticación admin — server-only.
 * Cookie httpOnly "honey-admin-session" almacena ADMIN_SESSION_TOKEN.
 * NUNCA importar desde componentes cliente.
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "honey-admin-session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 horas

/** Verifica la cookie de sesión admin. Devuelve true si es válida. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const token = process.env.ADMIN_SESSION_TOKEN;
  if (!token) return false;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE);
  if (!sessionCookie) return false;

  return sessionCookie.value === token;
}

/**
 * Guard para Server Components y layouts protegidos.
 * Redirige a /admin/login si la sesión no es válida.
 */
export async function requireAdminAuth(): Promise<void> {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/admin/login");
  }
}

/** Opciones para la cookie de sesión admin. */
export function getSessionCookieOptions(value: string) {
  return {
    name: ADMIN_COOKIE,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  };
}

/** Opciones para borrar la cookie (maxAge = 0). */
export function getDeleteCookieOptions() {
  return {
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
  };
}
