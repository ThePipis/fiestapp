'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface EventConfig {
  id: number;
  cumpleanera_nombre: string;
  evento_lugar: string;
  evento_fecha: string;
  evento_hora: string;
}

const DEFAULT_CONFIG: EventConfig = {
  id: 1,
  cumpleanera_nombre: 'Mamá Zara',
  evento_lugar: 'Lima, Perú',
  evento_fecha: '2026-05-23',
  evento_hora: '19:00'
};

// Normalizar hora de formato TIME de PostgreSQL (HH:MM:SS) a HH:MM
const normalizeTime = (time: string): string => {
  if (!time) return '19:00';
  return time.substring(0, 5); // Tomar solo HH:MM
};

export const useEventConfig = () => {
  const queryClient = useQueryClient();

  const { data: config = DEFAULT_CONFIG, isLoading } = useQuery({
    queryKey: ['event_config'],
    queryFn: async () => {
      try {
        // Cast a any porque la tabla config no está en los tipos generados
        const { data, error } = await (supabase.from('config' as any) as any)
          .select('*')
          .eq('id', 1)
          .single();
        
        if (error) {
          console.error('Error cargando config desde Supabase:', error.message);
          const local = typeof window !== 'undefined' ? localStorage.getItem('event_config') : null;
          return local ? JSON.parse(local) : DEFAULT_CONFIG;
        }
        
        const normalizedData: EventConfig = {
          id: data.id,
          cumpleanera_nombre: data.cumpleanera_nombre || DEFAULT_CONFIG.cumpleanera_nombre,
          evento_lugar: data.evento_lugar || DEFAULT_CONFIG.evento_lugar,
          evento_fecha: data.evento_fecha || DEFAULT_CONFIG.evento_fecha,
          evento_hora: normalizeTime(data.evento_hora)
        };
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('event_config', JSON.stringify(normalizedData));
        }
        
        return normalizedData;
      } catch (err) {
        console.warn('Error inesperado, usando configuración local/defecto:', err);
        const local = typeof window !== 'undefined' ? localStorage.getItem('event_config') : null;
        return local ? JSON.parse(local) : DEFAULT_CONFIG;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const updateConfig = useMutation({
    mutationFn: async (updates: Partial<EventConfig>) => {
      const finalData = { 
        id: 1,
        cumpleanera_nombre: updates.cumpleanera_nombre ?? config.cumpleanera_nombre,
        evento_lugar: updates.evento_lugar ?? config.evento_lugar,
        evento_fecha: updates.evento_fecha ?? config.evento_fecha,
        evento_hora: updates.evento_hora ?? config.evento_hora
      };
      
      // Cast a any porque la tabla config no está en los tipos generados
      const { data, error } = await (supabase.from('config' as any) as any)
        .upsert(finalData, { onConflict: 'id' })
        .select()
        .single();
      
      if (error) {
        console.error('Error guardando config en Supabase:', error.message);
        if (typeof window !== 'undefined') {
          localStorage.setItem('event_config', JSON.stringify(finalData));
        }
        throw new Error('No se pudo guardar en la base de datos.');
      }
      
      const savedData: EventConfig = {
        id: data.id,
        cumpleanera_nombre: data.cumpleanera_nombre,
        evento_lugar: data.evento_lugar,
        evento_fecha: data.evento_fecha,
        evento_hora: normalizeTime(data.evento_hora)
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('event_config', JSON.stringify(savedData));
      }
      
      console.info('✅ Configuración guardada en Supabase correctamente');
      return savedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event_config'] });
    },
    onError: (error) => {
      console.error('Error en mutación:', error);
    }
  });

  return { config, isLoading, updateConfig };
};

