import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Tables, InsertTables, UpdateTables } from '@/types/supabase';

export const useGuests = () => {
  const queryClient = useQueryClient();

  const { data: guests = [], isLoading, error } = useQuery({
    queryKey: ['invitados'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invitados')
        .select('*')
        .order('nombre');
      if (error) throw error;
      return data as Tables<'invitados'>[];
    },
  });

  const createGuest = useMutation({
    mutationFn: async (newGuest: InsertTables<'invitados'>) => {
      const { data, error } = await supabase
        .from('invitados')
        .insert(newGuest)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitados'] });
    },
  });

  const updateGuest = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateTables<'invitados'> }) => {
      const { data, error } = await supabase
        .from('invitados')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitados'] });
    },
  });

  const deleteGuest = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('invitados').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitados'] });
    },
  });

  return { guests, isLoading, error, createGuest, updateGuest, deleteGuest };
};
