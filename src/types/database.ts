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
