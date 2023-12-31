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
      attribute: {
        Row: {
          code: string | null
          created_at: string | null
          id: number
          image: string | null
          name: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: number
          image?: string | null
          name?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: number
          image?: string | null
          name?: string | null
        }
        Relationships: []
      }
      content: {
        Row: {
          code: string | null
          created_at: string | null
          id: number
          image: string | null
          name: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: number
          image?: string | null
          name?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: number
          image?: string | null
          name?: string | null
        }
        Relationships: []
      }
      equip: {
        Row: {
          code: string | null
          created_at: string | null
          id: number
          name: string | null
          type_id: number | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          type_id?: number | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          type_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "equip_type_id_fkey"
            columns: ["type_id"]
            referencedRelation: "type"
            referencedColumns: ["id"]
          }
        ]
      }
      hero: {
        Row: {
          attribute_id: number | null
          banner: string | null
          code: string
          created_at: string | null
          id: number
          image: string | null
          name: string | null
          tier_id: number | null
          type_id: number | null
          updated_at: string | null
        }
        Insert: {
          attribute_id?: number | null
          banner?: string | null
          code: string
          created_at?: string | null
          id?: number
          image?: string | null
          name?: string | null
          tier_id?: number | null
          type_id?: number | null
          updated_at?: string | null
        }
        Update: {
          attribute_id?: number | null
          banner?: string | null
          code?: string
          created_at?: string | null
          id?: number
          image?: string | null
          name?: string | null
          tier_id?: number | null
          type_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hero_attribute_id_fkey"
            columns: ["attribute_id"]
            referencedRelation: "attribute"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hero_tier_id_fkey"
            columns: ["tier_id"]
            referencedRelation: "tier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hero_type_id_fkey"
            columns: ["type_id"]
            referencedRelation: "type"
            referencedColumns: ["id"]
          }
        ]
      }
      skill: {
        Row: {
          code: string | null
          created_at: string | null
          id: number
          name: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      tier: {
        Row: {
          code: string | null
          created_at: string | null
          id: number
          image: string | null
          name: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: number
          image?: string | null
          name?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: number
          image?: string | null
          name?: string | null
        }
        Relationships: []
      }
      type: {
        Row: {
          code: string | null
          created_at: string | null
          id: number
          image: string | null
          name: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: number
          image?: string | null
          name?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: number
          image?: string | null
          name?: string | null
        }
        Relationships: []
      }
      upgrades: {
        Row: {
          code: string | null
          created_at: string | null
          id: number
          name: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
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
