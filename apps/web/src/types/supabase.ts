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
      gastos: {
        Row: {
          categoria: string | null
          costo: number | null
          created_at: string | null
          id: string
          item: string
          pagos: Json | null
          responsable: string[] | null
        }
        Insert: {
          categoria?: string | null
          costo?: number | null
          created_at?: string | null
          id?: string
          item: string
          pagos?: Json | null
          responsable?: string[] | null
        }
        Update: {
          categoria?: string | null
          costo?: number | null
          created_at?: string | null
          id?: string
          item?: string
          pagos?: Json | null
          responsable?: string[] | null
        }
        Relationships: []
      }
      invitados: {
        Row: {
          adultos: number | null
          created_at: string | null
          estado: string | null
          grupo: string | null
          id: string
          ninos: number | null
          nombre: string
          responsable: string[] | null
          vinculo: string | null
        }
        Insert: {
          adultos?: number | null
          created_at?: string | null
          estado?: string | null
          grupo?: string | null
          id?: string
          ninos?: number | null
          nombre: string
          responsable?: string[] | null
          vinculo?: string | null
        }
        Update: {
          adultos?: number | null
          created_at?: string | null
          estado?: string | null
          grupo?: string | null
          id?: string
          ninos?: number | null
          nombre?: string
          responsable?: string[] | null
          vinculo?: string | null
        }
        Relationships: []
      }
      tareas: {
        Row: {
          completada: boolean | null
          created_at: string | null
          descripcion: string
          id: string
          responsable: string | null
        }
        Insert: {
          completada?: boolean | null
          created_at?: string | null
          descripcion: string
          id?: string
          responsable?: string | null
        }
        Update: {
          completada?: boolean | null
          created_at?: string | null
          descripcion?: string
          id?: string
          responsable?: string | null
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

// Helper types for easier use
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
