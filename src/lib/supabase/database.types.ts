export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      w3_items: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          indent: boolean
          list_id: string
          position: number
          updated_at: string
          what: string
          when_date: string | null
          when_time: string | null
          who: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          indent?: boolean
          list_id: string
          position?: number
          updated_at?: string
          what?: string
          when_date?: string | null
          when_time?: string | null
          who?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          indent?: boolean
          list_id?: string
          position?: number
          updated_at?: string
          what?: string
          when_date?: string | null
          when_time?: string | null
          who?: string
        }
        Relationships: [
          {
            foreignKeyName: "w3_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "w3_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      w3_lists: {
        Row: {
          archived: boolean
          created_at: string
          id: string
          is_public: boolean
          owner_id: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          archived?: boolean
          created_at?: string
          id?: string
          is_public?: boolean
          owner_id: string
          position?: number
          title?: string
          updated_at?: string
        }
        Update: {
          archived?: boolean
          created_at?: string
          id?: string
          is_public?: boolean
          owner_id?: string
          position?: number
          title?: string
          updated_at?: string
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

type DefaultSchema = Database["public"]

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"]
