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

export const useEventConfig = () => {
  const queryClient = useQueryClient();

  const { data: config = DEFAULT_CONFIG, isLoading } = useQuery({
    queryKey: ['event_config'],
    queryFn: async () => {
      // 1. Intentar cargar desde localStorage primero para velocidad
      const local = typeof window !== 'undefined' ? localStorage.getItem('event_config') : null;
      let initialData = local ? JSON.parse(local) : DEFAULT_CONFIG;

      try {
        const { data, error } = await supabase
          .from('config' as any)
          .select('*')
          .eq('id', 1)
          .single();
        
        if (error) throw error;
        
        // Sincronizar local con DB
        if (typeof window !== 'undefined') localStorage.setItem('event_config', JSON.stringify(data));
        return data as unknown as EventConfig;
      } catch (err) {
        console.warn('Usando configuración local/defecto');
        return initialData;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const updateConfig = useMutation({
    mutationFn: async (updates: Partial<EventConfig>) => {
      const finalData = { ...config, ...updates, id: 1 };
      
      // Actualizar local inmediatamente
      if (typeof window !== 'undefined') localStorage.setItem('event_config', JSON.stringify(finalData));

      const { data, error } = await supabase
        .from('config' as any)
        .upsert(finalData)
        .select();
      
      if (error) {
        if (error.message.includes('public.config')) {
          console.info('Configuración guardada localmente. Para persistir en la nube, crea la tabla "config" en el Dashboard de Supabase.');
        } else {
          console.error('Error guardando en Supabase:', error.message);
        }
        return finalData;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event_config'] });
    },
  });

  return { config, isLoading, updateConfig };
};
