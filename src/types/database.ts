export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      promotions: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number | null
          old_price: number | null
          discount_percent: number | null
          url: string
          image: string | null
          source_telegram_group: string
          store: string | null
          category: string | null
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price?: number | null
          old_price?: number | null
          discount_percent?: number | null
          url: string
          image?: string | null
          source_telegram_group: string
          store?: string | null
          category?: string | null
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number | null
          old_price?: number | null
          discount_percent?: number | null
          url?: string
          image?: string | null
          source_telegram_group?: string
          store?: string | null
          category?: string | null
          created_at?: string
          expires_at?: string | null
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          promotion_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          promotion_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          promotion_id?: string
          created_at?: string
        }
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
  }
}

export type Promotion = Database['public']['Tables']['promotions']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']
