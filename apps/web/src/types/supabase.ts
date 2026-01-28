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
      }
    }
  }
}
