export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      "appoinmnet reminder": {
        Row: {
          appoinmentt_date: string | null
          appointment_id: string | null
          appointment_time: string | null
          created_at: string
          doctor_name: string | null
          id: number
          location: string | null
        }
        Insert: {
          appoinmentt_date?: string | null
          appointment_id?: string | null
          appointment_time?: string | null
          created_at?: string
          doctor_name?: string | null
          id?: number
          location?: string | null
        }
        Update: {
          appoinmentt_date?: string | null
          appointment_id?: string | null
          appointment_time?: string | null
          created_at?: string
          doctor_name?: string | null
          id?: number
          location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appoinmnet reminder_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user table"
            referencedColumns: ["id"]
          },
        ]
      }
      "emergency contacts table": {
        Row: {
          contact_id: number
          contact_name: string | null
          contact_phone: string | null
          id: number
        }
        Insert: {
          contact_id: number
          contact_name?: string | null
          contact_phone?: string | null
          id?: number
        }
        Update: {
          contact_id?: number
          contact_name?: string | null
          contact_phone?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "emergency contacts table_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "user table"
            referencedColumns: ["id"]
          },
        ]
      }
      "medication reminder table": {
        Row: {
          created_at: string
          id: number
          medication_name: string | null
          reminder_id: number
          reminder_time: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          medication_name?: string | null
          reminder_id: number
          reminder_time?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          medication_name?: string | null
          reminder_id?: number
          reminder_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medication reminder table_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "user table"
            referencedColumns: ["id"]
          },
        ]
      }
      "user table": {
        Row: {
          email: string | null
          id: number
          name: string
          password: string | null
          phone: string | null
        }
        Insert: {
          email?: string | null
          id?: number
          name: string
          password?: string | null
          phone?: string | null
        }
        Update: {
          email?: string | null
          id?: number
          name?: string
          password?: string | null
          phone?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
