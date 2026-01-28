'use client';

import { useGuests } from '@/hooks/useGuests';
import { Pencil, Trash2, PlusCircle, Check, ChevronDown, FileSpreadsheet, Printer, Users } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

export default function GuestsView() {
  const { guests, isLoading, updateGuest, deleteGuest } = useGuests();
  const { setModalType, setIsModalOpen, setEditingId } = useAppStore();

  const handleOpenAdd = () => {
    setModalType('guest');
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    setEditingId(id);
    setModalType('guest');
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse font-bold text-slate-400 uppercase tracking-widest">Cargando invitados...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 gap-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-4">
          <div className="bg-indigo-100 p-2.5 rounded-2xl text-indigo-600"><Users size={24} /></div>
          Control de Asistencia
        </h2>
        <div className="flex gap-3">
          <button className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-6 py-4 rounded-3xl transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest border border-emerald-100 shadow-sm">
            <FileSpreadsheet size={18} /> Excel
          </button>
          <button className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-6 py-4 rounded-3xl transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest border border-slate-200 shadow-sm">
            <Printer size={18} /> PDF
          </button>
          <button 
            onClick={handleOpenAdd}
            className="premium-gradient hover:shadow-indigo-200/50 shadow-xl text-white px-8 py-4 rounded-3xl transition-all active:scale-95 flex items-center gap-3 font-black text-xs uppercase tracking-widest"
          >
            <PlusCircle size={20} /> Añadir
          </button>
        </div>
      </div>

      <DataTable 
        columns={[
          { header: 'Invitado', className: 'w-1/3' },
          { header: 'Adultos', className: 'text-center w-24' },
          { header: 'Niños', className: 'text-center w-24' },
          { header: 'Responsables', className: 'w-1/4' },
          { header: 'Estado', className: 'w-48' },
          { header: 'Gestión', className: 'text-right w-32' }
        ]}
        isEmpty={guests.length === 0}
        emptyMessage="No hay invitados registrados todavía."
      >
        {guests.map((inv) => (
          <tr key={inv.id} className="hover:bg-slate-50/40 transition-all group">
            <td className="px-8 py-7">
              <p className="font-black text-slate-800 text-sm mb-1 uppercase tracking-tight">{inv.nombre}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{inv.vinculo} • <span className="text-indigo-400">{inv.grupo}</span></p>
            </td>
            <td className="px-4 py-7 text-center">
              <span className="text-base font-black text-slate-700">{inv.adultos}</span>
            </td>
            <td className="px-4 py-7 text-center">
              <span className={`text-base font-black ${inv.ninos! > 0 ? 'text-amber-500 bg-amber-50 px-3 py-1.5 rounded-2xl' : 'text-slate-200'}`}>
                {inv.ninos! > 0 ? inv.ninos : '-'}
              </span>
            </td>
            <td className="px-6 py-7">
              <div className="flex flex-wrap gap-2">
                {inv.responsable?.map((r: string) => (
                  <span key={r} className="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border bg-white shadow-sm border-slate-100 text-slate-600">
                    {r}
                  </span>
                ))}
              </div>
            </td>
            <td className="px-6 py-7">
               {/* Status select placeholder - we can make a nicer one later */}
               <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${
                  inv.estado === 'Confirmado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  inv.estado === 'Cancelado' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                  'bg-amber-50 text-amber-700 border-amber-100'
               }`}>
                  {inv.estado}
               </span>
            </td>
            <td className="px-8 py-7 text-right">
              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <button 
                  onClick={() => handleOpenEdit(inv.id)}
                  className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                >
                  <Pencil size={18} />
                </button>
                <button 
                  onClick={() => deleteGuest.mutate(inv.id)}
                  className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
