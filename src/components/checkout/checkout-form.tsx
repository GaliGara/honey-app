"use client";

import { useState, useEffect } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/use-cart";
import { checkoutSchema, type CheckoutSchema } from "@/lib/validations/order";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createOrder } from "@/lib/supabase/orders";
import type { OrderSummaryData } from "@/types/order";
import OrderSummary from "./order-summary";
import CheckoutEmptyState from "./checkout-empty-state";

/* ── Constants ─────────────────────────────────────────────── */

const SHIPPING = 8;
const TAXES = 0;

function generateOrderNumber(): string {
  return `HNY-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

/* ── Field sub-components ───────────────────────────────────── */

interface InputFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  type?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
}

function InputField({
  label,
  registration,
  type = "text",
  required,
  error,
  placeholder,
  className = "",
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const { onBlur: regOnBlur, ...restReg } = registration;

  const borderColor = error
    ? "rgba(200,70,50,0.55)"
    : focused
    ? "#D4AF37"
    : "rgba(212,175,55,0.28)";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={registration.name}
        style={{
          color: "#6F5635",
          fontSize: "0.72rem",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          fontWeight: 500,
        }}
      >
        {label}
        {required && (
          <span style={{ color: "#B87514", marginLeft: 3 }}>*</span>
        )}
      </label>
      <input
        id={registration.name}
        type={type}
        placeholder={placeholder}
        {...restReg}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          regOnBlur(e);
        }}
        style={{
          background: "rgba(255,255,255,0.72)",
          border: `1px solid ${borderColor}`,
          borderRadius: 10,
          padding: "0.6rem 0.875rem",
          fontSize: "0.9rem",
          color: "#2C1E11",
          outline: "none",
          width: "100%",
          transition: "border-color 0.18s",
          fontFamily: "var(--font-inter)",
        }}
      />
      {error && (
        <span
          style={{
            color: "rgba(200,70,50,0.85)",
            fontSize: "0.7rem",
            letterSpacing: "0.02em",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

interface TextareaFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  placeholder?: string;
}

function TextareaField({ label, registration, placeholder }: TextareaFieldProps) {
  const [focused, setFocused] = useState(false);
  const { onBlur: regOnBlur, ...restReg } = registration;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={registration.name}
        style={{
          color: "#6F5635",
          fontSize: "0.72rem",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          fontWeight: 500,
        }}
      >
        {label}
      </label>
      <textarea
        id={registration.name}
        rows={3}
        placeholder={placeholder}
        {...restReg}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          regOnBlur(e);
        }}
        style={{
          background: "rgba(255,255,255,0.72)",
          border: `1px solid ${focused ? "#D4AF37" : "rgba(212,175,55,0.28)"}`,
          borderRadius: 10,
          padding: "0.6rem 0.875rem",
          fontSize: "0.9rem",
          color: "#2C1E11",
          outline: "none",
          resize: "vertical",
          width: "100%",
          transition: "border-color 0.18s",
          fontFamily: "var(--font-inter)",
          minHeight: 80,
        }}
      />
    </div>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 mb-4">
      <div>
        <h3
          style={{
            fontFamily: "var(--font-playfair)",
            color: "#2C1E11",
            fontSize: "1.05rem",
            fontWeight: 600,
          }}
        >
          {title}
        </h3>
        <div className="gold-divider mt-2" style={{ maxWidth: 100 }} />
      </div>
      {children}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ color: "#B87514", flexShrink: 0, marginTop: 1 }}
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ color: "rgba(200,70,50,0.85)", flexShrink: 0, marginTop: 1 }}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

/* ── Loading skeleton ───────────────────────────────────────── */

function LoadingSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-8 animate-pulse">
      <div className="flex flex-col gap-4">
        {[200, 220, 120].map((h, i) => (
          <div
            key={i}
            style={{
              height: h,
              borderRadius: 16,
              background: "rgba(255,255,255,0.45)",
            }}
          />
        ))}
      </div>
      <div
        style={{
          height: 380,
          borderRadius: 16,
          background: "rgba(255,255,255,0.45)",
        }}
      />
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */

export default function CheckoutForm() {
  const [mounted, setMounted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const closeCart = useCartStore((s) => s.closeCart);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      notes: "",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <LoadingSkeleton />;
  if (items.length === 0) return <CheckoutEmptyState />;

  const subtotal = getSubtotal();
  const total = subtotal + SHIPPING + TAXES;
  const configured = isSupabaseConfigured();

  async function onSubmit(data: CheckoutSchema) {
    setSubmitError(null);

    if (!configured) {
      setSubmitError(
        "Supabase no está configurado. Agrega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local para habilitar el guardado de pedidos."
      );
      return;
    }

    try {
      const orderNumber = generateOrderNumber();
      const currentSubtotal = getSubtotal();
      const currentTotal = currentSubtotal + SHIPPING + TAXES;

      const { orderNumber: confirmedNumber } = await createOrder({
        orderNumber,
        customerName: data.fullName,
        customerEmail: data.email,
        customerPhone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state || undefined,
        postalCode: data.postalCode || undefined,
        notes: data.notes || undefined,
        items,
        subtotal: currentSubtotal,
        shipping: SHIPPING,
        taxes: TAXES,
        total: currentTotal,
      });

      const orderSummary: OrderSummaryData = {
        orderNumber: confirmedNumber,
        customerName: data.fullName,
        customerEmail: data.email,
        total: currentTotal,
        itemCount: items.reduce((s, i) => s + i.quantity, 0),
        createdAt: new Date().toISOString(),
      };

      sessionStorage.setItem("honey-last-order", JSON.stringify(orderSummary));
      clearCart();
      closeCart();
      router.push(`/gracias?order=${confirmedNumber}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al procesar tu pedido. Por favor intenta nuevamente."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>

      {/* ── Supabase not configured warning ── */}
      {!configured && (
        <div
          className="glass-panel rounded-xl px-5 py-4 mb-6 flex items-start gap-3"
          style={{ borderColor: "rgba(184,117,20,0.4)" }}
        >
          <WarningIcon />
          <div className="flex flex-col gap-1">
            <p
              style={{
                color: "#B87514",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              Supabase no está configurado
            </p>
            <p style={{ color: "#6F5635", fontSize: "0.8rem", lineHeight: 1.5 }}>
              Agrega{" "}
              <code
                style={{
                  background: "rgba(212,175,55,0.15)",
                  borderRadius: 4,
                  padding: "0 4px",
                  fontSize: "0.75rem",
                }}
              >
                NEXT_PUBLIC_SUPABASE_URL
              </code>{" "}
              y{" "}
              <code
                style={{
                  background: "rgba(212,175,55,0.15)",
                  borderRadius: 4,
                  padding: "0 4px",
                  fontSize: "0.75rem",
                }}
              >
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{" "}
              en{" "}
              <code
                style={{
                  background: "rgba(212,175,55,0.15)",
                  borderRadius: 4,
                  padding: "0 4px",
                  fontSize: "0.75rem",
                }}
              >
                .env.local
              </code>{" "}
              para habilitar el guardado de pedidos.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-8 items-start">

        {/* ── Left: Form fields ── */}
        <div>
          <FormSection title="Información de contacto">
            <InputField
              label="Nombre completo"
              registration={register("fullName")}
              error={errors.fullName?.message}
              required
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <InputField
                label="Email"
                registration={register("email")}
                type="email"
                error={errors.email?.message}
                required
              />
              <InputField
                label="Teléfono"
                registration={register("phone")}
                type="tel"
                error={errors.phone?.message}
                required
                placeholder="+52 55 0000 0000"
              />
            </div>
          </FormSection>

          <FormSection title="Dirección de envío">
            <InputField
              label="Dirección"
              registration={register("address")}
              error={errors.address?.message}
              required
              placeholder="Calle, número, colonia"
            />
            <div className="grid sm:grid-cols-3 gap-4">
              <InputField
                label="Ciudad"
                registration={register("city")}
                error={errors.city?.message}
                required
                className="sm:col-span-2"
              />
              <InputField
                label="Estado"
                registration={register("state")}
              />
            </div>
            <InputField
              label="Código postal"
              registration={register("postalCode")}
              placeholder="00000"
              className="sm:max-w-[200px]"
            />
          </FormSection>

          <FormSection title="Notas del pedido">
            <TextareaField
              label="Instrucciones especiales (opcional)"
              registration={register("notes")}
              placeholder="Referencias de entrega, horarios preferidos..."
            />
          </FormSection>

          {/* Submit error */}
          {submitError && (
            <div
              className="glass-panel rounded-xl px-5 py-4 mb-4 flex items-start gap-3"
              style={{ borderColor: "rgba(200,70,50,0.3)" }}
            >
              <ErrorIcon />
              <p style={{ color: "rgba(200,70,50,0.9)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                {submitError}
              </p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting || !configured}
            className="premium-button w-full text-base flex items-center justify-center gap-2.5 mt-2"
            style={
              isSubmitting || !configured
                ? { opacity: 0.55, cursor: "not-allowed" }
                : {}
            }
          >
            {isSubmitting ? (
              "Guardando pedido..."
            ) : (
              <>
                Confirmar pedido
                <ArrowIcon />
              </>
            )}
          </button>

          <p
            className="text-[9px] text-center uppercase tracking-[0.22em] mt-5"
            style={{ color: "rgba(111,86,53,0.4)" }}
          >
            Pago seguro · Devolución 30 días · Envío premium
          </p>
        </div>

        {/* ── Right: Order summary (sticky desktop) ── */}
        <div className="lg:sticky lg:top-28">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shipping={SHIPPING}
            total={total}
          />
        </div>
      </div>
    </form>
  );
}
