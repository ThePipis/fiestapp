'use client';

import { useGuests } from '@/hooks/useGuests';
import { Pencil, Trash2, PlusCircle, FileSpreadsheet, Printer, Users, ChevronDown, Check } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import { useAppStore } from '@/store/useAppStore';
import { exportGuestsToExcel, exportGuestsToPDF } from '@/lib/exportService';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Search, X, Filter, LayoutGrid } from 'lucide-react';
import { useState } from 'react';

// Colores Semáforo Estilo Neón/Dark
const ESTADOS = [
  { value: 'Pendiente', label: 'PENDIENTE', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20' },
  { value: 'Confirmado', label: 'CONFIRMADO', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' },
  { value: 'Cancelado', label: 'CANCELADO', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' },
];

const RESPONSABLE_COLORS = [
  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
];

function getResponsableColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % RESPONSABLE_COLORS.length;
  return RESPONSABLE_COLORS[index];
}

function StatusDropdown({ currentStatus, onSelect }: { currentStatus: string | null; onSelect: (status: string) => void }) {
  const current = ESTADOS.find(e => e.value === currentStatus) || ESTADOS[0];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${current.color} outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          aria-label={`Cambiar estado de ${current.label}`}
        >
          {current.label}
          <ChevronDown size={14} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="w-44 bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200 outline-none"
        >
          {ESTADOS.map((estado) => (
            <DropdownMenu.Item
              key={estado.value}
              onSelect={() => onSelect(estado.value)}
              className={`w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all outline-none cursor-pointer hover:bg-white/5 focus:bg-white/5 ${
                estado.value === currentStatus ? estado.color : 'text-slate-400'
              }`}
            >
              {estado.label}
              {estado.value === currentStatus && <Check size={14} />}
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Arrow className="fill-[#1E293B]" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default function GuestsView() {
  const { guests, isLoading, updateGuest, deleteGuest } = useGuests();
  const { setModalType, setIsModalOpen, setEditingId } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredGuests = guests.filter(g => {
    const term = searchTerm.toLowerCase();
    const guestName = (g.nombre || '').toLowerCase();
    const guestGroup = (g.grupo || '').toLowerCase();
    
    const matchesSearch = guestName.includes(term) || guestGroup.includes(term);
    const matchesStatus = filterStatus ? g.estado === filterStatus : true;
    
    return matchesSearch && matchesStatus;
  });

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

  const handleStatusChange = (id: string, newStatus: string) => {
    updateGuest.mutate({ id, updates: { estado: newStatus } });
  };

  const handleExportExcel = () => {
    exportGuestsToExcel(guests);
  };

  const handleExportPDF = () => {
    exportGuestsToPDF(guests);
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse font-bold text-slate-400 uppercase tracking-widest">Cargando invitados...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 mt-12">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 gap-6">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
          <div className="bg-indigo-500/20 p-2.5 rounded-2xl text-indigo-400 border border-indigo-500/20"><Users size={24} /></div>
          Control de Asistencia
        </h2>
        <div className="flex gap-3">
          <button 
            onClick={handleExportExcel}
            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-6 py-4 rounded-3xl transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest border border-emerald-500/20 shadow-sm"
          >
            <FileSpreadsheet size={18} /> Excel (.xlsx)
          </button>
          <button 
            onClick={handleExportPDF}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-4 rounded-3xl transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest border border-slate-700 shadow-sm"
          >
            <Printer size={18} /> PDF
          </button>
          <button 
            onClick={handleOpenAdd}
            className="premium-gradient hover:shadow-indigo-500/20 shadow-xl text-white px-8 py-4 rounded-3xl transition-all active:scale-95 flex items-center gap-3 font-black text-xs uppercase tracking-widest border border-white/10"
          >
            <PlusCircle size={20} /> Añadir
          </button>
        </div>
      </div>
      <div />

      {/* Search Bar & Filters Ultra-Optimized */}
      <div className="bg-[#1E293B]/50 backdrop-blur-md p-2 pl-4 rounded-[2.5rem] border border-white/5 shadow-xl shadow-black/20 flex flex-col md:flex-row items-center gap-4 mx-2 md:mx-0">
        <div className="flex-1 w-full flex items-center gap-4 h-14 pr-4">
          <Search size={22} className="text-slate-500" />
          <input 
            type="text"
            placeholder="Buscar por nombre, familia o grupo..."
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
          {(() => {
            // Calcular qué estados existen en los datos
            const hasPendientes = guests.some(g => g.estado === 'Pendiente');
            const hasConfirmados = guests.some(g => g.estado === 'Confirmado');
            const hasCancelados = guests.some(g => g.estado === 'Cancelado');
            
            // Construir tabs dinámicamente
            const tabs: string[] = ['Todos'];
            if (hasPendientes) tabs.push('Pendiente');
            if (hasConfirmados) tabs.push('Confirmado');
            if (hasCancelados) tabs.push('Cancelado');
            
            return tabs.map(status => (
              <button 
                key={status} 
                onClick={() => setFilterStatus(status === 'Todos' ? null : status)}
                className={`px-6 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${ 
                  (filterStatus === status || (status === 'Todos' && !filterStatus)) 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ));
          })()}
        </div>
      </div>

      <DataTable 
        columns={[
          { header: 'Invitado', className: 'w-1/3 text-slate-400' },
          { header: 'Adultos', className: 'text-center w-24 text-slate-400' },
          { header: 'Niños', className: 'text-center w-24 text-slate-400' },
          { header: 'Responsables', className: 'w-1/4 text-slate-400' },
          { header: 'Estado', className: 'w-48 text-slate-400' },
          { header: 'Gestión', className: 'text-right w-32 text-slate-400' }
        ]}
        isEmpty={filteredGuests.length === 0}
        emptyMessage={searchTerm ? `No se encontraron resultados para "${searchTerm}"` : "No hay invitados registrados todavía."}
      >
        {filteredGuests.map((inv) => (
          <tr key={inv.id} className="hover:bg-white/5 transition-all group border-b border-white/5 last:border-0">
            <td className="px-8 py-7">
              <p className="font-black text-white text-sm mb-1 uppercase tracking-tight">{inv.nombre}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">{inv.vinculo} • <span className="text-indigo-400">{inv.grupo}</span></p>
            </td>
            <td className="px-4 py-7 text-center">
              <span className="text-base font-black text-slate-300">{inv.adultos}</span>
            </td>
            <td className="px-4 py-7 text-center">
              <span className={`text-base font-black ${inv.ninos! > 0 ? 'text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-2xl border border-amber-500/20' : 'text-slate-600'}`}>
                {inv.ninos! > 0 ? inv.ninos : '-'}
              </span>
            </td>
            <td className="px-6 py-7">
              <div className="flex flex-wrap gap-2">
                {inv.responsable?.map((r: string) => (
                  <span key={r} className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border ${getResponsableColor(r)}`}>
                    {r}
                  </span>
                ))}
              </div>
            </td>
            <td className="px-6 py-7">
              <StatusDropdown 
                currentStatus={inv.estado} 
                onSelect={(newStatus) => handleStatusChange(inv.id, newStatus)} 
              />
            </td>
            <td className="px-8 py-7 text-right">
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => handleOpenEdit(inv.id)}
                  aria-label="Editar invitado"
                  className="p-3 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-2xl transition-all outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <Pencil size={18} />
                </button>
                <button 
                  onClick={() => deleteGuest.mutate(inv.id)}
                  aria-label="Eliminar invitado"
                  className="p-3 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-2xl transition-all outline-none focus:ring-2 focus:ring-rose-500"
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
