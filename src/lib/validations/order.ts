import { z } from "zod";

export const PAYMENT_METHOD_VALUES = [
  "bank_transfer",
  "bank_deposit",
  "cash_on_delivery",
] as const;

export const checkoutSchema = z.object({
  fullName: z.string().min(1, "El nombre completo es requerido"),
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Introduce un email válido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  city: z.string().min(1, "La ciudad es requerida"),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(
    ["bank_transfer", "bank_deposit", "cash_on_delivery"],
    { message: "Selecciona un método de pago" }
  ),
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;
