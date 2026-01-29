'use client';

import DashboardHeader from '@/components/features/DashboardHeader';
import TabNavigation from '@/components/shared/TabNavigation';
import GuestsView from '@/components/features/GuestsView';
import ExpensesView from '@/components/features/ExpensesView';
import TasksView from '@/components/features/TasksView';
import ModalContainer from '@/components/shared/ModalContainer';
import GuestForm from '@/components/features/GuestForm';
import ExpenseForm from '@/components/features/ExpenseForm';
import { useAppStore } from '@/store/useAppStore';
import { useGuests } from '@/hooks/useGuests';
import { useExpenses } from '@/hooks/useExpenses';
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import ConfigView from '@/components/features/ConfigView';

export default function Home() {
  const { activeTab } = useAppStore();
  const { guests } = useGuests();
  const { expenses } = useExpenses();

  const resumen = useMemo(() => {
    const listaValida = guests.filter(i => i.estado !== 'Cancelado');
    const totalAdultosLista = listaValida.reduce((acc, i) => acc + (Number(i.adultos) || 0), 0);
    const totalNinosLista = listaValida.reduce((acc, i) => acc + (Number(i.ninos) || 0), 0);
    const confirmados = listaValida.filter(i => i.estado === 'Confirmado');
    const totalConfirmados = confirmados.reduce((acc, i) => acc + (Number(i.adultos) || 0) + (Number(i.ninos) || 0), 0);
    
    let presupuestoTotal = 0;
    let totalPagado = 0;
    expenses.forEach(e => {
      const costo = Number(e.costo) || 0;
      presupuestoTotal += costo;
      const pagos = e.pagos as Record<string, number> || {};
      const pagado = Object.values(pagos).reduce((sum, val) => sum + (Number(val) || 0), 0);
      totalPagado += Math.min(pagado, costo);
    });

    return { 
      totalLista: totalAdultosLista + totalNinosLista, 
      totalAdultosLista, 
      totalNinosLista, 
      totalConfirmados, 
      totalPendientes: (totalAdultosLista + totalNinosLista) - totalConfirmados,
      presupuestoTotal,
      totalPagado
    };
  }, [guests, expenses]);

  return (
    <main className="min-h-screen bg-[#0F172A] pb-32">
      <DashboardHeader resumen={resumen} />
      <TabNavigation />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'invitados' && <GuestsView />}
            {activeTab === 'presupuesto' && <ExpensesView />}
            {activeTab === 'logistica' && <TasksView />}
            
            {activeTab === 'asistente' && (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-xl">
                <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Asistente AI próximamente...</p>
              </div>
            )}
            
            {activeTab === 'consola' && <ConfigView />}
          </motion.div>
        </AnimatePresence>
      </div>

      <ModalContainer 
        title={
          useAppStore.getState().modalType === 'guest' 
            ? (useAppStore.getState().editingId ? 'Editar Invitado' : 'Añadir Invitado') 
            : useAppStore.getState().modalType === 'expense'
            ? (useAppStore.getState().editingId ? 'Editar Registro' : 'Añadir Registro')
            : 'Formulario'
        }
      >
        {useAppStore.getState().modalType === 'guest' && <GuestForm />}
        {useAppStore.getState().modalType === 'expense' && <ExpenseForm />}
      </ModalContainer>
    </main>
  );
}
