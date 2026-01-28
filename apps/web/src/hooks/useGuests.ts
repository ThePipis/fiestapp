import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { Guest } from '@/schemas';

type GuestRow = Database['public']['Tables']['invitados']['Row'];
type GuestInsert = Database['public']['Tables']['invitados']['Insert'];
type GuestUpdate = Database['public']['Tables']['invitados']['Update'];

export const useGuests = () => {
  const queryClient = useQueryClient();

  const { data: guests = [], isLoading, error } = useQuery<GuestRow[]>({
    queryKey: ['invitados'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invitados')
        .select('*');
      if (error) throw error;
      return data || [];
    },
  });

  const createGuest = useMutation({
    mutationFn: async (newGuest: GuestInsert) => {
      const { data, error } = await supabase.from('invitados').insert(newGuest).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitados'] });
    },
  });

  const updateGuest = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: GuestUpdate }) => {
      const { data, error } = await supabase.from('invitados').update(updates).eq('id', id).select();
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
