import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type TaskRow = Database['public']['Tables']['tareas']['Row'];
type TaskInsert = Database['public']['Tables']['tareas']['Insert'];
type TaskUpdate = Database['public']['Tables']['tareas']['Update'];

export const useTasks = () => {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, error } = useQuery<TaskRow[]>({
    queryKey: ['tareas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tareas')
        .select('*');
      if (error) throw error;
      return data || [];
    },
  });

  const createTask = useMutation({
    mutationFn: async (newTask: TaskInsert) => {
      const { data, error } = await supabase.from('tareas').insert(newTask).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TaskUpdate }) => {
      const { data, error } = await supabase.from('tareas').update(updates).eq('id', id).select();
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
