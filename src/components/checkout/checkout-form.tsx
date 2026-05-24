"use client";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/use-cart";
import type {
  CheckoutFormData,
  CheckoutFormErrors,
  OrderSummaryData,
} from "@/types/order";
import OrderSummary from "./order-summary";
import CheckoutEmptyState from "./checkout-empty-state";

/* ── Constants ─────────────────────────────────────────────── */

const SHIPPING = 8;
const TAXES = 0;

const EMPTY_FORM: CheckoutFormData = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  notes: "",
};

/* ── Validation ─────────────────────────────────────────────── */

function validate(data: CheckoutFormData): CheckoutFormErrors {
  const e: CheckoutFormErrors = {};
  if (!data.fullName.trim()) e.fullName = "El nombre completo es requerido";
  if (!data.email.trim()) {
    e.email = "El email es requerido";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    e.email = "Introduce un email válido";
  }
  if (!data.phone.trim()) e.phone = "El teléfono es requerido";
  if (!data.address.trim()) e.address = "La dirección es requerida";
  if (!data.city.trim()) e.city = "La ciudad es requerida";
  return e;
}

function generateOrderNumber(): string {
  return `HNY-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

/* ── Sub-components ─────────────────────────────────────────── */

interface InputFieldProps {
  label: string;
  name: keyof CheckoutFormData;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  error,
  placeholder,
  className = "",
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? "rgba(200,70,50,0.55)"
    : focused
    ? "#D4AF37"
    : "rgba(212,175,55,0.28)";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={name}
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
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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
  name: keyof CheckoutFormData;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

function TextareaField({ label, name, value, onChange, placeholder }: TextareaFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
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
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

function FormSection({ title, children }: FormSectionProps) {
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

/* ── Main component ─────────────────────────────────────────── */

export default function CheckoutForm() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const closeCart = useCartStore((s) => s.closeCart);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid lg:grid-cols-[1fr_400px] gap-8 animate-pulse">
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                height: n === 3 ? 120 : 200,
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

  if (items.length === 0) return <CheckoutEmptyState />;

  const subtotal = getSubtotal();
  const total = subtotal + SHIPPING + TAXES;

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CheckoutFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleChange(e);
  }

  function handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    handleChange(e);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(firstKey);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);
    const orderNumber = generateOrderNumber();
    const orderData: OrderSummaryData = {
      orderNumber,
      customerName: formData.fullName,
      customerEmail: formData.email,
      total,
      itemCount: items.reduce((s, i) => s + i.quantity, 0),
      createdAt: new Date().toISOString(),
    };

    sessionStorage.setItem("honey-last-order", JSON.stringify(orderData));
    clearCart();
    closeCart();
    router.push(`/gracias?order=${orderNumber}`);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-8 items-start">

        {/* ── Left: Form fields ── */}
        <div>
          <FormSection title="Información de contacto">
            <InputField
              label="Nombre completo"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              error={errors.fullName}
              required
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
              />
              <InputField
                label="Teléfono"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                required
                placeholder="+52 55 0000 0000"
              />
            </div>
          </FormSection>

          <FormSection title="Dirección de envío">
            <InputField
              label="Dirección"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              error={errors.address}
              required
              placeholder="Calle, número, colonia"
            />
            <div className="grid sm:grid-cols-3 gap-4">
              <InputField
                label="Ciudad"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                error={errors.city}
                required
                className="sm:col-span-2"
              />
              <InputField
                label="Estado"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              />
            </div>
            <InputField
              label="Código postal"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              placeholder="00000"
              className="sm:max-w-[200px]"
            />
          </FormSection>

          <FormSection title="Notas del pedido">
            <TextareaField
              label="Instrucciones especiales (opcional)"
              name="notes"
              value={formData.notes}
              onChange={handleTextareaChange}
              placeholder="Referencias de entrega, horarios preferidos..."
            />
          </FormSection>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="premium-button w-full text-base flex items-center justify-center gap-2.5 mt-2"
            style={isSubmitting ? { opacity: 0.65, cursor: "wait" } : {}}
          >
            {isSubmitting ? (
              "Procesando..."
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
