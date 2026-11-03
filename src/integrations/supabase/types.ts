export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_otps: {
        Row: {
          code_hash: string
          created_at: string
          expires_at: string
          id: string
          used: boolean
        }
        Insert: {
          code_hash: string
          created_at?: string
          expires_at: string
          id?: string
          used?: boolean
        }
        Update: {
          code_hash?: string
          created_at?: string
          expires_at?: string
          id?: string
          used?: boolean
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          created_at: string
          expires_at: string
          token_hash: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          token_hash: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          token_hash?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          appointment_date: string
          appointment_time: string
          balance_usd: number
          created_at: string
          custom_description: string | null
          customer_name: string
          deposit_usd: number
          discount_pct: number
          email: string
          final_price_usd: number
          id: string
          notes: string | null
          payment_method: string
          payment_status: string
          phone: string
          placement: string | null
          price_usd: number
          ref: string
          reminders_enabled: boolean
          size: string | null
          status: string
          tattoo_slug: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          balance_usd: number
          created_at?: string
          custom_description?: string | null
          customer_name: string
          deposit_usd: number
          discount_pct?: number
          email: string
          final_price_usd: number
          id?: string
          notes?: string | null
          payment_method?: string
          payment_status?: string
          phone: string
          placement?: string | null
          price_usd: number
          ref: string
          reminders_enabled?: boolean
          size?: string | null
          status?: string
          tattoo_slug?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          balance_usd?: number
          created_at?: string
          custom_description?: string | null
          customer_name?: string
          deposit_usd?: number
          discount_pct?: number
          email?: string
          final_price_usd?: number
          id?: string
          notes?: string | null
          payment_method?: string
          payment_status?: string
          phone?: string
          placement?: string | null
          price_usd?: number
          ref?: string
          reminders_enabled?: boolean
          size?: string | null
          status?: string
          tattoo_slug?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          booking_ref: string | null
          created_at: string
          id: string
          title: string
        }
        Insert: {
          body: string
          booking_ref?: string | null
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          body?: string
          booking_ref?: string | null
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_usd: number | null
          booking_ref: string | null
          created_at: string
          id: string
          payer_email: string | null
          provider: string
          raw: Json | null
          status: string | null
          txn_id: string | null
        }
        Insert: {
          amount_usd?: number | null
          booking_ref?: string | null
          created_at?: string
          id?: string
          payer_email?: string | null
          provider?: string
          raw?: Json | null
          status?: string | null
          txn_id?: string | null
        }
        Update: {
          amount_usd?: number | null
          booking_ref?: string | null
          created_at?: string
          id?: string
          payer_email?: string | null
          provider?: string
          raw?: Json | null
          status?: string | null
          txn_id?: string | null
        }
        Relationships: []
      }
      site_presence: {
        Row: {
          last_seen: string
          path: string | null
          visitor_id: string
        }
        Insert: {
          last_seen?: string
          path?: string | null
          visitor_id: string
        }
        Update: {
          last_seen?: string
          path?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
