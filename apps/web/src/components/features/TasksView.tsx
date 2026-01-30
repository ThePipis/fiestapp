'use client';

import { useTasks } from '@/hooks/useTasks';
import { Pencil, Trash2, PlusCircle, ClipboardList, CheckCircle2, Clock, Check } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

export default function TasksView() {
  const { tasks, isLoading, updateTask, deleteTask } = useTasks();
  const { setModalType, setIsModalOpen, setEditingId } = useAppStore();

  const handleOpenAdd = () => {
    setModalType('task');
    setEditingId(null);
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse font-bold text-slate-400 uppercase tracking-widest">Cargando tareas...</div>;

  const pendingTasks = tasks.filter(t => !t.completada).length;
  const completedTasks = tasks.filter(t => t.completada).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 mt-12">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 gap-6">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
          <div className="bg-amber-500/20 p-2.5 rounded-2xl text-amber-400 border border-amber-500/20"><ClipboardList size={24} /></div>
          Logística y Tareas
        </h2>
        <div className="flex gap-4">
           <div className="flex items-center gap-3 bg-[#1E293B] px-5 py-3 rounded-full border border-slate-700">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-300">{completedTasks} Listas</span>
           </div>
           <div className="flex items-center gap-3 bg-[#1E293B] px-5 py-3 rounded-full border border-slate-700">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-300">{pendingTasks} Pendientes</span>
           </div>
           <button 
            onClick={handleOpenAdd}
            className="premium-gradient text-white px-8 py-4 rounded-3xl transition-all active:scale-95 flex items-center gap-3 font-black text-xs uppercase tracking-widest shadow-xl border border-white/10"
          >
            <PlusCircle size={20} /> Nueva Tarea
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">No hay herramientas de logística configuradas.</div>
        ) : (
          tasks.map((task) => (
            <motion.div 
              key={task.id}
              whileHover={{ y: -5 }}
              className={`p-8 rounded-[2.5rem] border transition-all ${
                task.completada ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-[#1E293B] border-slate-700 shadow-lg shadow-black/20'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${task.completada ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                  {task.completada ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                </div>
                <div className="flex gap-1">
                  <button 
                    aria-label="Editar tarea"
                    className="p-2 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => deleteTask.mutate(task.id)} 
                    aria-label="Eliminar tarea"
                    className="p-2 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors outline-none focus:ring-2 focus:ring-rose-500 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <h3 className={`text-lg font-black leading-tight mb-4 ${task.completada ? 'text-slate-500 line-through' : 'text-white'}`}>
                {task.descripcion}
              </h3>
              
              <div className="flex justify-between items-center mt-auto">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                  {task.responsable || 'Sin responsable'}
                </span>
                <button 
                  onClick={() => updateTask.mutate({ id: task.id, updates: { completada: !task.completada } })}
                  aria-label={task.completada ? "Marcar como pendiente" : "Marcar como completada"}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all outline-none focus:ring-4 ${
                    task.completada 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 focus:ring-emerald-500/20' 
                    : 'bg-white/10 text-slate-400 hover:bg-indigo-600 hover:text-white focus:ring-indigo-500/20'
                  }`}
                >
                  <Check size={24} strokeWidth={3} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
