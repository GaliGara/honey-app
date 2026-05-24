export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          address: string;
          city: string;
          state: string | null;
          postal_code: string | null;
          notes: string | null;
          subtotal: number;
          shipping: number;
          taxes: number;
          total: number;
          status: string;
          /** Procesador de pago: 'mercado_pago' */
          payment_provider: string | null;
          /** Estado del pago: pending_payment | paid | payment_failed | cancelled | refunded */
          payment_status: string;
          /** ID de pago devuelto por Mercado Pago (payment_id) */
          payment_reference: string | null;
          /** ID de preferencia creada en Mercado Pago */
          payment_preference_id: string | null;
          /** URL de checkout de Mercado Pago */
          payment_init_point: string | null;
          /** Detalle adicional del estado (ej: accredited, pending_contingency) */
          payment_status_detail: string | null;
          paid_at: string | null;
          cancelled_at: string | null;
          /** Método elegido por el cliente: bank_transfer | bank_deposit | cash_on_delivery | mercado_pago */
          payment_method: string | null;
          /** Instrucciones de pago generadas por el servidor */
          payment_instructions: string | null;
          /** URL del comprobante de pago subido por el cliente (uso futuro) */
          payment_proof_url: string | null;
          /** Referencia manual = order_number para métodos no-pasarela */
          manual_payment_reference: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          address: string;
          city: string;
          state?: string | null;
          postal_code?: string | null;
          notes?: string | null;
          subtotal: number;
          shipping: number;
          taxes: number;
          total: number;
          status?: string;
          payment_provider?: string | null;
          payment_status?: string;
          payment_reference?: string | null;
          payment_preference_id?: string | null;
          payment_init_point?: string | null;
          payment_status_detail?: string | null;
          paid_at?: string | null;
          cancelled_at?: string | null;
          payment_method?: string | null;
          payment_instructions?: string | null;
          payment_proof_url?: string | null;
          manual_payment_reference?: string | null;
          created_at?: string;
        };
        Update: Partial<{
          order_number: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          address: string;
          city: string;
          state: string | null;
          postal_code: string | null;
          notes: string | null;
          subtotal: number;
          shipping: number;
          taxes: number;
          total: number;
          status: string;
          payment_provider: string | null;
          payment_status: string;
          payment_reference: string | null;
          payment_preference_id: string | null;
          payment_init_point: string | null;
          payment_status_detail: string | null;
          paid_at: string | null;
          cancelled_at: string | null;
          payment_method: string | null;
          payment_instructions: string | null;
          payment_proof_url: string | null;
          manual_payment_reference: string | null;
        }>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_slug: string;
          product_name: string;
          product_category: string;
          product_size: string | null;
          quantity: number;
          unit_price: number;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_slug: string;
          product_name: string;
          product_category: string;
          product_size?: string | null;
          quantity: number;
          unit_price: number;
          total: number;
          created_at?: string;
        };
        Update: Partial<{
          order_id: string;
          product_id: string;
          product_slug: string;
          product_name: string;
          product_category: string;
          product_size: string | null;
          quantity: number;
          unit_price: number;
          total: number;
        }>;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
