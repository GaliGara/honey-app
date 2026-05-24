"use client";

import { useState, useEffect } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/use-cart";
import { checkoutSchema, type CheckoutSchema } from "@/lib/validations/order";
import type { OrderSummaryData, PaymentMethod, PaymentStatus } from "@/types/order";
import OrderSummary from "./order-summary";
import CheckoutEmptyState from "./checkout-empty-state";

/* ── Constants ─────────────────────────────────────────────── */

const SHIPPING = 8;
const TAXES = 0;

/* ── API response type ──────────────────────────────────────── */

interface OrderApiResponse {
  ok: boolean;
  orderId?: string;
  orderNumber?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  message?: string;
}

/* ── Payment method options ─────────────────────────────────── */

interface PaymentOption {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
}

function TransferIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 16V4m0 0L3 8m4-4l4 4" />
      <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="1" y="3" width="15" height="13" rx="2" />
      <path d="M16 8h4l3 5v3h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "bank_transfer",
    label: "Transferencia SPEI",
    description:
      "Sin comisión de pasarela. Recibirás los datos bancarios al confirmar tu pedido.",
    icon: <TransferIcon />,
    badge: "Sin comisión",
  },
  {
    id: "bank_deposit",
    label: "Depósito bancario",
    description:
      "Realiza tu depósito y comparte el comprobante para confirmar.",
    icon: <BankIcon />,
  },
  {
    id: "cash_on_delivery",
    label: "Pago contra entrega",
    description: "Disponible solo en zonas seleccionadas.",
    icon: <TruckIcon />,
  },
  {
    id: "mercado_pago",
    label: "Mercado Pago",
    description:
      "Paga con tarjeta o medios disponibles en Mercado Pago. Puede aplicar comisión de procesamiento.",
    icon: <CardIcon />,
  },
];

/* ── PaymentMethodCard sub-component ───────────────────────── */

interface PaymentMethodCardProps {
  option: PaymentOption;
  selected: boolean;
  onSelect: () => void;
}

function PaymentMethodCard({ option, selected, onSelect }: PaymentMethodCardProps) {
  const borderColor = selected ? "#D4AF37" : "rgba(212,175,55,0.22)";
  const bg = selected
    ? "rgba(212,175,55,0.07)"
    : "rgba(255,255,255,0.55)";

  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(); } }}
      className="flex items-start gap-4 rounded-xl px-4 py-3.5 cursor-pointer transition-all duration-200"
      style={{
        border: `1.5px solid ${borderColor}`,
        background: bg,
        outline: "none",
      }}
    >
      {/* Icon square */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: selected
            ? "rgba(212,175,55,0.18)"
            : "rgba(212,175,55,0.08)",
          border: `1px solid ${selected ? "rgba(212,175,55,0.4)" : "rgba(212,175,55,0.15)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: selected ? "#B87514" : "rgba(111,86,53,0.5)",
          flexShrink: 0,
          transition: "all 0.2s",
        }}
      >
        {option.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-sm font-semibold"
            style={{
              fontFamily: "var(--font-playfair)",
              color: selected ? "#2C1E11" : "#6F5635",
            }}
          >
            {option.label}
          </span>
          {option.badge && (
            <span
              className="text-[8px] uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-full"
              style={{
                background: "rgba(212,175,55,0.15)",
                color: "#B87514",
                border: "1px solid rgba(212,175,55,0.25)",
              }}
            >
              {option.badge}
            </span>
          )}
        </div>
        <p
          className="text-xs mt-0.5 leading-relaxed"
          style={{ color: "rgba(111,86,53,0.7)" }}
        >
          {option.description}
        </p>
      </div>

      {/* Check indicator */}
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          border: `2px solid ${selected ? "#D4AF37" : "rgba(212,175,55,0.3)"}`,
          background: selected
            ? "linear-gradient(135deg, #D4AF37, #B87514)"
            : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 2,
          transition: "all 0.2s",
          color: "white",
        }}
      >
        {selected && <CheckIcon />}
      </div>
    </div>
  );
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

function LoadingSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-8 animate-pulse">
      <div className="flex flex-col gap-4">
        {[200, 220, 260, 120].map((h, i) => (
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
    setValue,
    watch,
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
      paymentMethod: "bank_transfer",
    },
  });

  const selectedPayment = watch("paymentMethod");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <LoadingSkeleton />;
  if (items.length === 0) return <CheckoutEmptyState />;

  const subtotal = getSubtotal();
  const total = subtotal + SHIPPING + TAXES;

  async function onSubmit(data: CheckoutSchema) {
    setSubmitError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state || undefined,
          postalCode: data.postalCode || undefined,
          notes: data.notes || undefined,
          paymentMethod: data.paymentMethod,
          items: items.map((item) => ({
            productId: item.productId,
            slug: item.slug,
            name: item.name,
            category: item.category,
            size: item.size,
            price: item.price,
            quantity: item.quantity,
          })),
          shipping: SHIPPING,
          taxes: TAXES,
        }),
      });

      const result = (await response.json()) as OrderApiResponse;

      if (!result.ok || !result.orderNumber) {
        throw new Error(
          result.message ?? "Error al procesar el pedido. Intenta nuevamente."
        );
      }

      /* ── Éxito: guardar resumen y redirigir ── */
      const currentSubtotal = getSubtotal();
      const currentTotal = currentSubtotal + SHIPPING + TAXES;

      const orderSummary: OrderSummaryData = {
        orderNumber: result.orderNumber,
        customerName: data.fullName,
        customerEmail: data.email,
        total: currentTotal,
        itemCount: items.reduce((s, i) => s + i.quantity, 0),
        createdAt: new Date().toISOString(),
        paymentMethod: result.paymentMethod ?? data.paymentMethod,
        paymentStatus: result.paymentStatus ?? "pending_payment",
      };

      sessionStorage.setItem("honey-last-order", JSON.stringify(orderSummary));
      clearCart();
      closeCart();
      router.push(`/gracias?order=${result.orderNumber}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al procesar tu pedido. Por favor intenta nuevamente."
      );
    }
  }

  const submitLabel =
    selectedPayment === "mercado_pago"
      ? "Confirmar y continuar"
      : "Confirmar pedido";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-8 items-start">

        {/* ── Left: Form fields ── */}
        <div>
          {/* Información de contacto */}
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

          {/* Dirección de envío */}
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

          {/* Método de pago */}
          <FormSection title="Método de pago">
            {errors.paymentMethod && (
              <p style={{ color: "rgba(200,70,50,0.85)", fontSize: "0.7rem" }}>
                {errors.paymentMethod.message}
              </p>
            )}
            <div
              className="flex flex-col gap-2.5"
              role="radiogroup"
              aria-label="Método de pago"
            >
              {PAYMENT_OPTIONS.map((opt) => (
                <PaymentMethodCard
                  key={opt.id}
                  option={opt}
                  selected={selectedPayment === opt.id}
                  onSelect={() =>
                    setValue("paymentMethod", opt.id, { shouldValidate: true })
                  }
                />
              ))}
            </div>
          </FormSection>

          {/* Notas del pedido */}
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
              <p
                style={{
                  color: "rgba(200,70,50,0.9)",
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                }}
              >
                {submitError}
              </p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="premium-button w-full text-base flex items-center justify-center gap-2.5 mt-2"
            style={isSubmitting ? { opacity: 0.65, cursor: "wait" } : {}}
          >
            {isSubmitting ? (
              "Guardando pedido..."
            ) : (
              <>
                {submitLabel}
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
