'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGuests } from '@/hooks/useGuests';
import { useAppStore } from '@/store/useAppStore';
import { useEffect } from 'react';
import type { InsertTables } from '@/types/supabase';
import { Check, Save } from 'lucide-react';

const RESPONSABLES = ['Jose', 'Luis', 'Carlos', 'Zara'] as const;

// Schema compatible con los tipos de Supabase
const GuestFormSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  vinculo: z.string().optional().nullable(),
  grupo: z.string().optional().nullable(),
  adultos: z.number().int().min(0).optional().nullable(),
  ninos: z.number().int().min(0).optional().nullable(),
  responsable: z.array(z.string()).optional().nullable(),
  estado: z.string().optional().nullable(),
});

type GuestFormData = z.infer<typeof GuestFormSchema>;

export default function GuestForm() {
  const { guests, createGuest, updateGuest } = useGuests();
  const { editingId, setIsModalOpen } = useAppStore();
  
  const editingGuest = guests.find(g => g.id === editingId);

  const { register, handleSubmit, formState: { errors }, reset, control, watch, setValue } = useForm<GuestFormData>({
    resolver: zodResolver(GuestFormSchema),
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

  const selectedResponsables = watch('responsable') || [];

  const toggleResponsable = (name: string) => {
    const current = selectedResponsables || [];
    if (current.includes(name)) {
      setValue('responsable', current.filter(r => r !== name));
    } else {
      setValue('responsable', [...current, name]);
    }
  };

  useEffect(() => {
    if (editingGuest) {
      reset({
        nombre: editingGuest.nombre,
        vinculo: editingGuest.vinculo ?? '',
        grupo: editingGuest.grupo ?? '',
        adultos: editingGuest.adultos ?? 1,
        ninos: editingGuest.ninos ?? 0,
        responsable: editingGuest.responsable ?? [],
        estado: editingGuest.estado ?? 'Pendiente'
      });
    }
  }, [editingGuest, reset]);

  const onSubmit = (data: GuestFormData) => {
    const payload: InsertTables<'invitados'> = {
      nombre: data.nombre,
      vinculo: data.vinculo,
      grupo: data.grupo,
      adultos: data.adultos,
      ninos: data.ninos,
      responsable: data.responsable,
      estado: data.estado,
    };

    if (editingId) {
      updateGuest.mutate({ id: editingId, updates: payload });
    } else {
      createGuest.mutate(payload);
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

        {/* Responsables - Selección Múltiple */}
        <div className="col-span-2">
          <label className={labelClasses}>Responsables (Múltiple)</label>
          <div className="grid grid-cols-2 gap-3">
            {RESPONSABLES.map((name) => {
              const isSelected = selectedResponsables.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleResponsable(name)}
                  className={`
                    flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-sm uppercase tracking-wider
                    transition-all duration-200 border-2
                    ${isSelected 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                    }
                  `}
                >
                  {isSelected && <Check className="w-4 h-4" />}
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-6 grid grid-cols-2 gap-4">
        <button 
          type="button" 
          onClick={() => setIsModalOpen(false)}
          className="w-full bg-white text-slate-500 font-black uppercase tracking-widest text-xs py-5 rounded-3xl border-2 border-slate-200 hover:border-slate-300 transition-all"
        >
          Cerrar
        </button>
        <button 
          type="submit" 
          className="w-full premium-gradient text-white font-black uppercase tracking-widest text-xs py-5 rounded-3xl shadow-xl shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {editingId ? 'Guardar Cambios' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
}
