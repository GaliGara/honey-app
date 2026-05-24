import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Cliente Supabase para uso exclusivo en el servidor (API Routes, Server Actions).
 * Usa SUPABASE_SERVICE_ROLE_KEY — NUNCA importar en componentes cliente.
 */
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase server no está configurado. " +
        "Agrega NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local"
    );
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      // En contexto de servidor no necesitamos sesión de usuario
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
