'use client';

import { useExpenses } from '@/hooks/useExpenses';
import { Pencil, Trash2, PlusCircle, DollarSign, FileSpreadsheet, Printer, Wallet, PieChart, Search, X } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useMemo, useState } from 'react';
import { exportExpensesToExcel, exportExpensesToPDF } from '@/lib/exportService';

export default function ExpensesView() {
  const { expenses, isLoading, deleteExpense } = useExpenses();
  const { setModalType, setIsModalOpen, setEditingId } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const financeStats = useMemo(() => {
    let total = 0;
    let paid = 0;
    expenses.forEach(e => {
      const costo = Number(e.costo) || 0;
      total += costo;
      const pagos = e.pagos as Record<string, number> || {};
      const totalPagado = Object.values(pagos).reduce((sum, val) => sum + (Number(val) || 0), 0);
      paid += Math.min(totalPagado, costo);
    });
    return { total, paid, remaining: total - paid };
  }, [expenses]);

  // Calcular gastos por responsable dinámicamente
  const gastosPorResponsable = useMemo(() => {
    const responsables: Record<string, number> = {
      'Carlos': 0,
      'Luis': 0,
      'Jose': 0
    };
    
    expenses.forEach(e => {
      const pagos = e.pagos as Record<string, number> || {};
      Object.entries(pagos).forEach(([nombre, monto]) => {
        const nombreNormalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
        if (responsables.hasOwnProperty(nombreNormalizado)) {
          responsables[nombreNormalizado] += Number(monto) || 0;
        } else {
          // Añadir nuevo responsable si aparece
          responsables[nombreNormalizado] = (responsables[nombreNormalizado] || 0) + (Number(monto) || 0);
        }
      });
    });
    
    return responsables;
  }, [expenses]);

  const filteredExpenses = expenses.filter(g => {
    const term = searchTerm.toLowerCase();
    const itemMatch = (g.item || '').toLowerCase().includes(term);
    const categoryMatch = (g.categoria || '').toLowerCase().includes(term);
    const searchMatch = itemMatch || categoryMatch;
    
    const filterMatch = filterCategory ? g.categoria === filterCategory : true;
    
    return searchMatch && filterMatch;
  });

  const categories = Array.from(new Set(expenses.map(e => e.categoria).filter(Boolean)));

  const handleOpenAdd = () => {
    setModalType('expense');
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    setEditingId(id);
    setModalType('expense');
    setIsModalOpen(true);
  };

  const handleExportExcel = () => {
    exportExpensesToExcel(expenses);
  };

  const handleExportPDF = () => {
    exportExpensesToPDF(expenses);
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse font-bold text-slate-400 uppercase tracking-widest">Cargando presupuesto...</div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 mt-12">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-[#1E293B] p-10 rounded-[3rem] border border-slate-700 shadow-xl relative overflow-hidden flex flex-col justify-center gap-6 group"
        >
          <div className="absolute right-0 top-0 p-8 opacity-5 text-emerald-400 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12"><PieChart size={160} /></div>
          <div>
            <div className="flex justify-between items-end mb-4">
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em] bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20">Pagado Total</span>
              <span className="text-sm font-black text-emerald-400">
                {financeStats.total > 0 ? Math.round((financeStats.paid / financeStats.total) * 100) : 0}%
              </span>
            </div>
            <p className="text-5xl font-black text-white tracking-tighter">S/ {financeStats.paid.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="w-full bg-white/5 h-4 rounded-full overflow-hidden border border-white/5 p-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${financeStats.total > 0 ? (financeStats.paid / financeStats.total) * 100 : 0}%` }}
              className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg shadow-emerald-500/20"
            />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="premium-gradient p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-center gap-6 group border border-white/10"
        >
          <div className="absolute right-0 top-0 p-8 opacity-20 text-white transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12"><Wallet size={160} /></div>
          <div>
            <div className="flex justify-between items-end mb-4">
              <span className="text-[10px] font-black uppercase text-white/80 tracking-[0.2em] bg-white/10 px-4 py-2 rounded-2xl border border-white/20">Pendiente Total</span>
              <span className="text-sm font-black text-indigo-100">
                {financeStats.total > 0 ? Math.round((financeStats.remaining / financeStats.total) * 100) : 0}%
              </span>
            </div>
            <p className="text-5xl font-black text-white tracking-tighter">S/ {financeStats.remaining.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden border border-white/5 p-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${financeStats.total > 0 ? (financeStats.remaining / financeStats.total) * 100 : 0}%` }}
              className="bg-white/80 h-full rounded-full transition-all duration-1000 ease-out"
            />
          </div>
        </motion.div>
      </div>

      {/* Gastos por Responsable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(gastosPorResponsable).map(([nombre, total], index) => {
          const colors = [
            { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', shadow: 'shadow-blue-500/10', icon: 'bg-blue-500/20 text-blue-400' },
            { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', shadow: 'shadow-purple-500/10', icon: 'bg-purple-500/20 text-purple-400' },
            { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', shadow: 'shadow-orange-500/10', icon: 'bg-orange-500/20 text-orange-400' },
          ];
          const color = colors[index % colors.length];
          const porcentaje = financeStats.paid > 0 ? Math.round((total / financeStats.paid) * 100) : 0;
          
          return (
            <motion.div
              key={nombre}
              whileHover={{ y: -3, scale: 1.02 }}
              className={`${color.bg} p-6 rounded-[2rem] border ${color.border} shadow-lg ${color.shadow} relative overflow-hidden group`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${color.icon} border ${color.border}`}>
                  <DollarSign size={20} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${color.text}`}>
                  {porcentaje}% del total pagado
                </span>
              </div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${color.text} mb-2`}>
                Contribución de
              </p>
              <p className="text-2xl font-black text-white mb-1">{nombre}</p>
              <p className={`text-3xl font-black ${color.text}`}>
                S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center px-4 gap-6">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
          <div className="bg-emerald-500/20 p-2.5 rounded-2xl text-emerald-400 border border-emerald-500/20"><DollarSign size={24} /></div>
          Detalle de Gastos
        </h2>
        <div className="flex gap-3">
          <button 
            onClick={handleExportExcel}
            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-6 py-4 rounded-3xl transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest border border-emerald-500/20 shadow-sm"
          >
            <FileSpreadsheet size={18} /> Excel
          </button>
          <button 
            onClick={handleExportPDF}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-4 rounded-3xl transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest border border-slate-700 shadow-sm"
          >
            <Printer size={18} /> PDF
          </button>
          <button 
            onClick={handleOpenAdd}
            className="bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-900/20 text-white px-8 py-4 rounded-3xl transition-all active:scale-95 flex items-center gap-3 font-black text-xs uppercase tracking-widest border border-white/10"
          >
            <PlusCircle size={20} /> Añadir
          </button>
        </div>
      </div>

      {/* Search Bar & Filters Ultra-Optimized */}
      <div className="bg-[#1E293B]/50 backdrop-blur-md p-2 pl-4 rounded-[2.5rem] border border-white/5 shadow-xl shadow-black/20 flex flex-col md:flex-row items-center gap-4 mx-2 md:mx-0">
        <div className="flex-1 w-full flex items-center gap-4 h-14 pr-4">
          <Search size={22} className="text-slate-500" />
          <input 
            type="text"
            placeholder="Buscar concepto o categoría..."
            className="flex-1 bg-transparent h-full outline-none text-base font-bold text-white placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-rose-400 transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 px-2 md:px-0 no-scrollbar">
          <button 
            onClick={() => setFilterCategory(null)}
            className={`px-6 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${ 
              !filterCategory
              ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
              : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setFilterCategory(cat === filterCategory ? null : cat)}
              className={`px-6 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${ 
                filterCategory === cat
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <DataTable 
        columns={[
          { header: 'Concepto', className: 'w-1/3 text-slate-400' },
          { header: 'Progreso Pago', className: 'w-1/4 text-slate-400' },
          { header: 'Costo Total', className: 'text-center w-40 text-slate-400' },
          { header: 'Estado', className: 'text-center w-32 text-slate-400' },
          { header: 'Gestión', className: 'text-right w-32 text-slate-400' }
        ]}
        isEmpty={filteredExpenses.length === 0}
        emptyMessage={searchTerm ? `No se encontraron gastos para "${searchTerm}"` : "No hay gastos registrados todavía."}
      >
        {filteredExpenses.map((g) => {
          const costo = Number(g.costo) || 0;
          const pagos = g.pagos as Record<string, number> || {};
          const paidAmount = Object.values(pagos).reduce((sum, val) => sum + (Number(val) || 0), 0);
          const percent = costo > 0 ? (paidAmount / costo) * 100 : 0;
          const status = paidAmount >= costo ? 'Pagado' : paidAmount > 0 ? 'En Proceso' : 'Pendiente';

          return (
            <tr key={g.id} className="hover:bg-white/5 transition-all group border-b border-white/5 last:border-0">
              <td className="px-8 py-8">
                <p className="font-black text-white text-sm mb-1 uppercase tracking-tight">{g.item}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 rounded-lg bg-white/10 text-[9px] font-bold text-slate-400 uppercase tracking-widest border border-white/10">
                    {g.categoria}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.responsable?.map((r, idx) => {
                    const colors = [
                      { bg: 'bg-blue-500/15', border: 'border-blue-500/30', dot: 'bg-blue-400', name: 'text-blue-300', amount: 'text-blue-400' },
                      { bg: 'bg-purple-500/15', border: 'border-purple-500/30', dot: 'bg-purple-400', name: 'text-purple-300', amount: 'text-purple-400' },
                      { bg: 'bg-orange-500/15', border: 'border-orange-500/30', dot: 'bg-orange-400', name: 'text-orange-300', amount: 'text-orange-400' },
                    ];
                    const color = colors[idx % colors.length];
                    return (
                      <div key={r} className={`flex items-center gap-2 ${color.bg} px-3 py-2 rounded-xl border ${color.border}`}>
                        <span className={`w-2 h-2 rounded-full ${color.dot}`}></span>
                        <span className={`text-xs font-black uppercase ${color.name}`}>{r}:</span>
                        <span className={`text-xs font-black ${color.amount}`}>S/{pagos[r] || 0}</span>
                      </div>
                    );
                  })}
                </div>
              </td>
              <td className="px-6 py-8 align-middle">
                <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden mb-3 border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percent, 100)}%` }}
                    className={`h-full rounded-full transition-all duration-700 ${status === 'Pagado' ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  />
                </div>
                <div className="flex justify-between text-sm font-black uppercase tracking-wider">
                  <div className="flex flex-col">
                    <span className="text-emerald-400">S/ {paidAmount.toFixed(2)}</span>
                    <span className="text-[10px] text-emerald-400/60 tracking-widest">Abonado</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-rose-400/80">S/ {Math.max(0, costo - paidAmount).toFixed(2)}</span>
                    <span className="text-[10px] text-rose-400/50 tracking-widest">Pendiente</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-8 text-center">
                <span className="text-lg font-black text-white">S/ {costo.toFixed(2)}</span>
              </td>
              <td className="px-6 py-8 text-center">
                <span className={`inline-block px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border whitespace-nowrap ${
                  status === 'Pagado' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                  status === 'En Proceso' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 
                  'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}>
                  {status === 'En Proceso' ? 'EN PROCESO' : status.toUpperCase()}
                </span>
              </td>
              <td className="px-8 py-8 text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => handleOpenEdit(g.id)} 
                    aria-label="Editar gasto"
                    className="p-3 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-2xl transition-all outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => deleteExpense.mutate(g.id)} 
                    aria-label="Eliminar gasto"
                    className="p-3 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-2xl transition-all outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </DataTable>
    </div>
  );
}
