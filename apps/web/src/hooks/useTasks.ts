import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Tables, InsertTables, UpdateTables } from '@/types/supabase';

export const useTasks = () => {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tareas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tareas')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Tables<'tareas'>[];
    },
  });

  const createTask = useMutation({
    mutationFn: async (newTask: InsertTables<'tareas'>) => {
      const { data, error } = await supabase
        .from('tareas')
        .insert(newTask)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateTables<'tareas'> }) => {
      const { data, error } = await supabase
        .from('tareas')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tareas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    },
  });

  return { tasks, isLoading, error, createTask, updateTask, deleteTask };
};
