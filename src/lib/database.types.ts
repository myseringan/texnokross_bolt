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
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          description: string
          price: number
          image_url: string
          specifications: Json
          in_stock: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          description: string
          price: number
          image_url: string
          specifications?: Json
          in_stock?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          description?: string
          price?: number
          image_url?: string
          specifications?: Json
          in_stock?: boolean
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          session_id: string
          product_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          product_id: string
          quantity?: number
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
        }
      }
    }
  }
}
