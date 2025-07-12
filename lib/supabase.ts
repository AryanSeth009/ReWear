import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          avatar_url: string | null
          bio: string | null
          points: number
          location: string | null
          rating: number
          total_swaps: number
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          avatar_url?: string | null
          bio?: string | null
          points?: number
          location?: string | null
          rating?: number
          total_swaps?: number
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          avatar_url?: string | null
          bio?: string | null
          points?: number
          location?: string | null
          rating?: number
          total_swaps?: number
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      items: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          category: string
          type: string
          size: string
          condition: string
          points: number
          tags: string[]
          images: string[]
          status: "pending" | "approved" | "rejected" | "swapped" | "redeemed"
          views: number
          likes: number
          available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          category: string
          type: string
          size: string
          condition: string
          points: number
          tags?: string[]
          images?: string[]
          status?: "pending" | "approved" | "rejected" | "swapped" | "redeemed"
          views?: number
          likes?: number
          available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          category?: string
          type?: string
          size?: string
          condition?: string
          points?: number
          tags?: string[]
          images?: string[]
          status?: "pending" | "approved" | "rejected" | "swapped" | "redeemed"
          views?: number
          likes?: number
          available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      swaps: {
        Row: {
          id: string
          requester_id: string
          owner_id: string
          requester_item_id: string | null
          owner_item_id: string
          message: string
          status: "pending" | "approved" | "rejected" | "completed"
          type: "swap" | "redeem"
          points_used: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          owner_id: string
          requester_item_id?: string | null
          owner_item_id: string
          message: string
          status?: "pending" | "approved" | "rejected" | "completed"
          type: "swap" | "redeem"
          points_used?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          owner_id?: string
          requester_item_id?: string | null
          owner_item_id?: string
          message?: string
          status?: "pending" | "approved" | "rejected" | "completed"
          type?: "swap" | "redeem"
          points_used?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          item_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_id?: string
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          item_id: string
          reason: string
          description: string | null
          status: "pending" | "resolved" | "dismissed"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          item_id: string
          reason: string
          description?: string | null
          status?: "pending" | "resolved" | "dismissed"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          item_id?: string
          reason?: string
          description?: string | null
          status?: "pending" | "resolved" | "dismissed"
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
