import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Tables, InsertTables, UpdateTables } from '@/types/supabase';

export const useExpenses = () => {
  const queryClient = useQueryClient();

  const { data: expenses = [], isLoading, error } = useQuery({
    queryKey: ['gastos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gastos')
        .select('*')
        .order('item');
      if (error) throw error;
      return data as Tables<'gastos'>[];
    },
  });

  const createExpense = useMutation({
    mutationFn: async (newExpense: InsertTables<'gastos'>) => {
      const { data, error } = await supabase
        .from('gastos')
        .insert(newExpense)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
    },
  });

  const updateExpense = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateTables<'gastos'> }) => {
      const { data, error } = await supabase
        .from('gastos')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
    },
  });

  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gastos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
    },
  });

  return { expenses, isLoading, error, createExpense, updateExpense, deleteExpense };
};
