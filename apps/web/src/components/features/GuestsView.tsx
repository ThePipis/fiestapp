'use client';

import { useGuests } from '@/hooks/useGuests';
import { Pencil, Trash2, PlusCircle, FileSpreadsheet, Printer, Users, ChevronDown, Check } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import { useAppStore } from '@/store/useAppStore';
import { exportGuestsToExcel, exportGuestsToPDF } from '@/lib/exportService';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const ESTADOS = [
  { value: 'Pendiente', label: 'PENDIENTE', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
  { value: 'Confirmado', label: 'CONFIRMADO', color: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' },
  { value: 'Cancelado', label: 'CANCELADO', color: 'bg-rose-100 text-rose-600 border-rose-200 hover:bg-rose-200' },
];

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
          className="w-44 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200 outline-none"
        >
          {ESTADOS.map((estado) => (
            <DropdownMenu.Item
              key={estado.value}
              onSelect={() => onSelect(estado.value)}
              className={`w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all outline-none cursor-pointer hover:bg-slate-50 focus:bg-slate-50 ${
                estado.value === currentStatus ? estado.color : 'text-slate-600'
              }`}
            >
              {estado.label}
              {estado.value === currentStatus && <Check size={14} />}
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Arrow className="fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

import { Search, X, Filter, LayoutGrid } from 'lucide-react';
import { useState } from 'react';

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 gap-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-4">
          <div className="bg-indigo-100 p-2.5 rounded-2xl text-indigo-600"><Users size={24} /></div>
          Control de Asistencia
        </h2>
        <div className="flex gap-3">
          <button 
            onClick={handleExportExcel}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-6 py-4 rounded-3xl transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest border border-emerald-100 shadow-sm"
          >
            <FileSpreadsheet size={18} /> Excel (.xlsx)
          </button>
          <button 
            onClick={handleExportPDF}
            className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-6 py-4 rounded-3xl transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest border border-slate-200 shadow-sm"
          >
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
      <div />

      {/* Search Bar & Filters Ultra-Optimized */}
      <div className="bg-white p-2 pl-4 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-4 mx-2 md:mx-0">
        <div className="flex-1 w-full flex items-center gap-4 h-14 pr-4">
          <Search size={22} className="text-slate-300" />
          <input 
            type="text"
            placeholder="Buscar por nombre, familia o grupo..."
            className="flex-1 bg-transparent h-full outline-none text-base font-bold text-slate-700 placeholder:text-slate-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-rose-500 transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 px-2 md:px-0 no-scrollbar">
          {['Todos', 'Pendiente', 'Confirmado'].map(status => (
            <button 
              key={status} 
              onClick={() => setFilterStatus(status === 'Todos' ? null : status)}
              className={`px-6 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${ 
                (filterStatus === status || (status === 'Todos' && !filterStatus)) 
                ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
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
        isEmpty={filteredGuests.length === 0}
        emptyMessage={searchTerm ? `No se encontraron resultados para "${searchTerm}"` : "No hay invitados registrados todavía."}
      >
        {filteredGuests.map((inv) => (
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
              <StatusDropdown 
                currentStatus={inv.estado} 
                onSelect={(newStatus) => handleStatusChange(inv.id, newStatus)} 
              />
            </td>
            <td className="px-8 py-7 text-right">
              {/* Botones siempre visibles */}
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => handleOpenEdit(inv.id)}
                  aria-label="Editar invitado"
                  className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <Pencil size={18} />
                </button>
                <button 
                  onClick={() => deleteGuest.mutate(inv.id)}
                  aria-label="Eliminar invitado"
                  className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all outline-none focus:ring-2 focus:ring-rose-500"
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
