'use client';

import { useEventConfig } from '@/hooks/useEventConfig';
import { Settings, User, MapPin, Calendar, Clock, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function ConfigView() {
  const { config, isLoading, updateConfig } = useEventConfig();
  const [formData, setFormData] = useState({
    cumpleanera_nombre: '',
    evento_lugar: '',
    evento_fecha: '',
    evento_hora: ''
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData({
        cumpleanera_nombre: config.cumpleanera_nombre || '',
        evento_lugar: config.evento_lugar || '',
        evento_fecha: config.evento_fecha || '',
        evento_hora: config.evento_hora || ''
      });
    }
  }, [config]);

  const handleSave = () => {
    updateConfig.mutate(formData, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  };

  if (isLoading) return <div className="p-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest">Cargando configuración...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600 shadow-xl shadow-indigo-100/50">
            <Settings size={28} className="animate-spin-slow" />
          </div>
          Configuración Maestro
        </h2>
        <button
          onClick={handleSave}
          disabled={updateConfig.isPending || saved}
          className={`w-full md:w-auto px-10 py-5 rounded-[2rem] transition-all active:scale-95 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.2em] shadow-2xl ${
            saved 
            ? 'bg-emerald-500 text-white shadow-emerald-200' 
            : 'bg-slate-900 hover:bg-black text-white shadow-slate-200'
          }`}
        >
          {updateConfig.isPending ? <Loader2 size={18} className="animate-spin" /> : saved ? <Save size={18} /> : <Save size={18} />}
          {updateConfig.isPending ? 'Guardando...' : saved ? '¡Sincronizado!' : 'Sincronizar cambios'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Name Config */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
        >
          <div className="absolute right-[-20px] top-[-20px] p-8 opacity-5 text-indigo-600 group-hover:scale-110 transition-transform duration-700">
            <User size={180} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 border border-slate-100">
                <User size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Protagonista</span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-tighter">Nombre de la Cumpleañera</label>
              <input 
                type="text"
                value={formData.cumpleanera_nombre}
                onChange={(e) => setFormData({...formData, cumpleanera_nombre: e.target.value})}
                placeholder="Ej. Mamá Zara"
                className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-3xl p-5 outline-none focus:border-indigo-500/30 transition-all font-bold text-slate-700"
              />
            </div>
          </div>
        </motion.div>

        {/* Location Config */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
        >
          <div className="absolute right-[-20px] top-[-20px] p-8 opacity-5 text-emerald-600 group-hover:scale-110 transition-transform duration-700">
            <MapPin size={180} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 border border-slate-100">
                <MapPin size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ubicación</span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-tighter">Lugar del Evento</label>
              <input 
                type="text"
                value={formData.evento_lugar}
                onChange={(e) => setFormData({...formData, evento_lugar: e.target.value})}
                placeholder="Ej. Salón Cristal, Lima"
                className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-3xl p-5 outline-none focus:border-emerald-500/30 transition-all font-bold text-slate-700"
              />
            </div>
          </div>
        </motion.div>

        {/* Date Config */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
        >
          <div className="absolute right-[-20px] top-[-20px] p-8 opacity-5 text-amber-600 group-hover:scale-110 transition-transform duration-700">
            <Calendar size={180} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 border border-slate-100">
                <Calendar size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha</span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-tighter">Día de la Celebración</label>
              <input 
                type="date"
                value={formData.evento_fecha}
                onChange={(e) => setFormData({...formData, evento_fecha: e.target.value})}
                className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-3xl p-5 outline-none focus:border-amber-500/30 transition-all font-bold text-slate-700"
              />
            </div>
          </div>
        </motion.div>

        {/* Time Config */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
        >
          <div className="absolute right-[-20px] top-[-20px] p-8 opacity-5 text-indigo-400 group-hover:scale-110 transition-transform duration-700">
            <Clock size={180} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 border border-slate-100">
                <Clock size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Horario</span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-tighter">Hora de Inicio</label>
              <input 
                type="time"
                value={formData.evento_hora}
                onChange={(e) => setFormData({...formData, evento_hora: e.target.value})}
                className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-3xl p-5 outline-none focus:border-indigo-400/30 transition-all font-bold text-slate-700"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-[#0F172A] p-10 rounded-[3.5rem] text-white overflow-hidden relative group">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-4">Misión Dashboard</h3>
          <p className="text-indigo-200/60 text-sm leading-relaxed max-w-lg mb-8">
            Cualquier cambio aquí se reflejará instantáneamente en la pantalla principal y en la cuenta regresiva. Asegúrate de que los datos sean precisos para mantener a todos los invitados sincronizados.
          </p>
          <div className="flex gap-4">
            <div className="h-1 w-20 bg-amber-500 rounded-full"></div>
            <div className="h-1 w-10 bg-indigo-500 rounded-full"></div>
            <div className="h-1 w-5 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
        <div className="absolute right-[-5%] bottom-[-5%] opacity-20 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
          <Settings size={220} />
        </div>
      </div>
    </div>
  );
}
