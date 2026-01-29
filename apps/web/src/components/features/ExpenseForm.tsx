'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useExpenses } from '@/hooks/useExpenses';
import { useAppStore } from '@/store/useAppStore';
import { useEffect, useState, useMemo } from 'react';
import type { InsertTables, Json } from '@/types/supabase';
import { Check, Save, Settings, AlertTriangle } from 'lucide-react';

const RESPONSABLES_PAGO = ['Jose', 'Luis', 'Carlos'] as const;

const CATEGORIAS = [
  'Catering',
  'Decoración',
  'Entretenimiento',
  'Local',
  'Transporte',
  'Fotografía',
  'Otros'
] as const;

const ExpenseFormSchema = z.object({
  item: z.string().min(2, "El concepto es obligatorio"),
  costo: z.number().min(0, "El monto debe ser positivo"),
  categoria: z.string().optional().nullable(),
  responsable: z.array(z.string()).optional().nullable(),
});

type ExpenseFormData = z.infer<typeof ExpenseFormSchema>;

export default function ExpenseForm() {
  const { expenses, createExpense, updateExpense } = useExpenses();
  const { editingId, setIsModalOpen } = useAppStore();
  
  const editingExpense = expenses.find(e => e.id === editingId);

  const [pagos, setPagos] = useState<Record<string, number>>({
    Jose: 0,
    Luis: 0,
    Carlos: 0
  });

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<ExpenseFormData>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: {
      item: '',
      costo: 0,
      categoria: 'Catering',
      responsable: [],
    }
  });

  const selectedResponsables = watch('responsable') || [];
  const costoTotal = watch('costo') || 0;

  // Calculate total payments and check if exceeded
  const { totalPagado, excesoMonto, hayExceso, montoFaltante } = useMemo(() => {
    const total = selectedResponsables.reduce((sum, name) => sum + (pagos[name] || 0), 0);
    const exceso = total - costoTotal;
    const faltante = Math.max(0, costoTotal - total);
    return {
      totalPagado: total,
      excesoMonto: exceso,
      hayExceso: exceso > 0.001, // Small tolerance for floating point
      montoFaltante: faltante
    };
  }, [pagos, selectedResponsables, costoTotal]);

  const toggleResponsable = (name: string) => {
    const current = selectedResponsables || [];
    if (current.includes(name)) {
      setValue('responsable', current.filter(r => r !== name));
      // Reset pago when deselected
      setPagos(prev => ({ ...prev, [name]: 0 }));
    } else {
      setValue('responsable', [...current, name]);
    }
  };

  const handlePagoChange = (name: string, value: number) => {
    const newValue = Math.max(0, value || 0);
    setPagos(prev => ({ ...prev, [name]: newValue }));
  };

  useEffect(() => {
    if (editingExpense) {
      reset({
        item: editingExpense.item,
        costo: editingExpense.costo ?? 0,
        categoria: editingExpense.categoria ?? 'Catering',
        responsable: editingExpense.responsable ?? [],
      });
      // Parse pagos from JSON
      const existingPagos = (editingExpense.pagos as Record<string, number>) || {};
      setPagos({
        Jose: existingPagos.Jose || 0,
        Luis: existingPagos.Luis || 0,
        Carlos: existingPagos.Carlos || 0,
      });
    }
  }, [editingExpense, reset]);

  const onSubmit = (data: ExpenseFormData) => {
    // Validate total payments don't exceed cost
    if (hayExceso) {
      return; // Don't submit if exceeded
    }

    // Filter pagos to only include selected responsables
    const filteredPagos: Record<string, number> = {};
    (data.responsable || []).forEach(r => {
      filteredPagos[r] = pagos[r] || 0;
    });

    const payload: InsertTables<'gastos'> = {
      item: data.item,
      costo: data.costo,
      categoria: data.categoria,
      responsable: data.responsable,
      pagos: filteredPagos as unknown as Json,
    };

    if (editingId) {
      updateExpense.mutate({ id: editingId, updates: payload });
    } else {
      createExpense.mutate(payload);
    }
    setIsModalOpen(false);
  };

  const inputClasses = "w-full bg-[#0F172A] border border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600";
  const labelClasses = "block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-4";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Concepto del Gasto */}
      <div>
        <label className={labelClasses}>Concepto del Gasto</label>
        <input {...register("item")} className={inputClasses} placeholder="Ej: Torta, DJ, Decoración..." />
        {errors.item && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-4 uppercase">{errors.item.message}</p>}
      </div>

      {/* Monto y Categoría */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Monto Estimado</label>
          <input 
            type="number" 
            step="0.01"
            {...register("costo", { valueAsNumber: true })} 
            className={inputClasses} 
            placeholder="0.00"
          />
        </div>
        
        <div>
          <label className={labelClasses}>Categoría</label>
          <select {...register("categoria")} className={inputClasses}>
            {CATEGORIAS.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Responsables del Pago */}
      <div>
        <label className={labelClasses}>Responsables del Pago</label>
        <div className="flex gap-3">
          {RESPONSABLES_PAGO.map((name) => {
            const isSelected = selectedResponsables.includes(name);
            return (
              <button
                key={name}
                type="button"
                onClick={() => toggleResponsable(name)}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-xs uppercase tracking-wider
                  transition-all duration-200 border-2
                  ${isSelected 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30' 
                    : 'bg-[#0F172A] text-slate-400 border-slate-700 hover:border-indigo-500 hover:text-indigo-400'
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

      {/* Registro de Abonos */}
      {selectedResponsables.length > 0 && (
        <div className={`rounded-3xl p-6 border transition-all ${hayExceso ? 'bg-rose-500/10 border-rose-500/20' : 'bg-[#0F172A] border-slate-700'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Settings className={`w-4 h-4 ${hayExceso ? 'text-rose-400' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${hayExceso ? 'text-rose-400' : 'text-slate-400'}`}>
                Registro de Abonos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-wider ${hayExceso ? 'text-rose-400' : 'text-emerald-400'}`}>
                S/ {totalPagado.toFixed(2)} / S/ {costoTotal.toFixed(2)}
              </span>
            </div>
          </div>
          
          {/* Mensaje de monto faltante */}
          {!hayExceso && montoFaltante > 0 && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
              <p className="text-amber-400 text-xs font-black text-center">
                ⏳ Falta <span className="text-amber-300 text-sm">S/ {montoFaltante.toFixed(2)}</span> para completar el pago
              </p>
            </div>
          )}
          
          {!hayExceso && montoFaltante === 0 && totalPagado > 0 && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <p className="text-emerald-400 text-xs font-black text-center">
                ✅ ¡Pago completo!
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            {selectedResponsables.map(name => (
              <div key={name} className="flex items-center gap-4">
                <span className={`w-20 px-3 py-2 rounded-xl text-[10px] font-black uppercase text-center ${hayExceso ? 'bg-rose-500/20 text-rose-300' : 'bg-indigo-500/20 text-indigo-300'}`}>
                  {name}
                </span>
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">S/</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={pagos[name] || ''}
                    onChange={(e) => handlePagoChange(name, parseFloat(e.target.value) || 0)}
                    className={`w-full bg-[#1E293B] border rounded-2xl pl-10 pr-4 py-3 text-sm font-bold text-white outline-none focus:ring-4 transition-all ${hayExceso ? 'border-rose-500/50 focus:ring-rose-500/20 focus:border-rose-500' : 'border-slate-600 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Error message when exceeded */}
          {hayExceso && (
            <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <div>
                <p className="text-rose-400 font-black text-xs uppercase tracking-wider">
                  Monto excedido en S/ {excesoMonto.toFixed(2)}
                </p>
                <p className="text-rose-300 text-[10px] font-bold mt-1">
                  La suma de abonos no puede superar el costo total del ítem.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botones */}
      <div className="pt-4 grid grid-cols-2 gap-4">
        <button 
          type="button" 
          onClick={() => setIsModalOpen(false)}
          className="w-full bg-[#0F172A] text-slate-400 font-black uppercase tracking-widest text-xs py-5 rounded-3xl border-2 border-slate-700 hover:border-slate-500 transition-all"
        >
          Cerrar
        </button>
        <button 
          type="submit" 
          disabled={hayExceso}
          className={`w-full font-black uppercase tracking-widest text-xs py-5 rounded-3xl shadow-xl transition-all flex items-center justify-center gap-2 border border-white/10 ${
            hayExceso 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none border-slate-700' 
              : 'premium-gradient text-white shadow-indigo-500/20 active:scale-95'
          }`}
        >
          <Save className="w-4 h-4" />
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}
