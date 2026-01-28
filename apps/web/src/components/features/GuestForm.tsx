'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GuestSchema, Guest } from '@/schemas';
import { useGuests } from '@/hooks/useGuests';
import { useAppStore } from '@/store/useAppStore';
import { useEffect } from 'react';

export default function GuestForm() {
  const { guests, createGuest, updateGuest } = useGuests();
  const { editingId, setIsModalOpen } = useAppStore();
  
  const editingGuest = guests.find(g => g.id === editingId);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Guest>({
    resolver: zodResolver(GuestSchema),
    defaultValues: {
      nombre: '',
      vinculo: '',
      grupo: 'Familia Directa',
      adultos: 1,
      ninos: 0,
      responsable: [],
      estado: 'Pendiente'
    }
  });

  useEffect(() => {
    if (editingGuest) {
      reset({
        nombre: editingGuest.nombre,
        vinculo: editingGuest.vinculo || '',
        grupo: editingGuest.grupo || '',
        adultos: editingGuest.adultos || 1,
        ninos: editingGuest.ninos || 0,
        responsable: editingGuest.responsable || [],
        estado: (editingGuest.estado as any) || 'Pendiente'
      });
    }
  }, [editingGuest, reset]);

  const onSubmit = (data: Guest) => {
    if (editingId) {
      updateGuest.mutate({ id: editingId, updates: data });
    } else {
      createGuest.mutate(data);
    }
    setIsModalOpen(false);
  };

  const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all";
  const labelClasses = "block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-4";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className={labelClasses}>Nombre Completo</label>
          <input {...register("nombre")} className={inputClasses} placeholder="Nombre del invitado" />
          {errors.nombre && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-4 uppercase">{errors.nombre.message}</p>}
        </div>
        
        <div>
          <label className={labelClasses}>Vínculo</label>
          <input {...register("vinculo")} className={inputClasses} placeholder="Ej: Primo, Amigo..." />
        </div>
        
        <div>
          <label className={labelClasses}>Grupo</label>
          <select {...register("grupo")} className={inputClasses}>
            <option value="Familia Directa">Familia Directa</option>
            <option value="Hermanos Zara">Hermanos Zara</option>
            <option value="Sobrinos">Sobrinos</option>
            <option value="Tíos">Tíos</option>
            <option value="Vecinos">Vecinos</option>
            <option value="Amigos">Amigos</option>
          </select>
        </div>

        <div>
           <label className={labelClasses}>Adultos</label>
           <input type="number" {...register("adultos", { valueAsNumber: true })} className={inputClasses} />
        </div>

        <div>
           <label className={labelClasses}>Niños</label>
           <input type="number" {...register("ninos", { valueAsNumber: true })} className={inputClasses} />
        </div>
      </div>

      <div className="pt-6">
        <button type="submit" className="w-full premium-gradient text-white font-black uppercase tracking-widest text-xs py-5 rounded-3xl shadow-xl shadow-indigo-100 active:scale-95 transition-all">
          {editingId ? 'Guardar Cambios' : 'Registrar Invitado'}
        </button>
      </div>
    </form>
  );
}
