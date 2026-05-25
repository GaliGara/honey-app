"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        const data = await res.json();

        if (!res.ok || !data.ok) {
          setError(data.message ?? "Error al iniciar sesión");
          return;
        }

        router.replace("/admin");
        router.refresh();
      } catch {
        setError("Error de conexión. Intenta de nuevo.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#6F5635",
          }}
        >
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
          placeholder="••••••••"
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "0.75rem",
            border: "1.5px solid rgba(184,117,20,0.28)",
            background: "rgba(255,255,255,0.7)",
            color: "#2C1E11",
            fontSize: "1rem",
            outline: "none",
            transition: "border-color 250ms ease, box-shadow 250ms ease",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(212,175,55,0.8)";
            e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.12)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(184,117,20,0.28)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {error && (
        <p
          role="alert"
          style={{
            fontSize: "0.85rem",
            color: "#c0392b",
            background: "rgba(192,57,43,0.07)",
            border: "1px solid rgba(192,57,43,0.2)",
            borderRadius: "0.5rem",
            padding: "0.6rem 0.875rem",
          }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || password.length === 0}
        className="premium-button"
        style={{ opacity: isPending || password.length === 0 ? 0.6 : 1 }}
      >
        {isPending ? "Verificando…" : "Ingresar al panel"}
      </button>
    </form>
  );
}
