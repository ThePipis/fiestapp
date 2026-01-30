'use client';

import { useEventConfig } from '@/hooks/useEventConfig';
import { Settings, User, MapPin, Calendar, Clock, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Convertir formato 24h a 12h para display
const convertTo12Hour = (time24: string): { hour: string; minute: string; period: 'AM' | 'PM' } => {
  if (!time24) return { hour: '07', minute: '00', period: 'PM' };
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return { 
    hour: hour12.toString().padStart(2, '0'), 
    minute: (minutes || 0).toString().padStart(2, '0'), 
    period 
  };
};

// Convertir formato 12h a 24h para guardar
const convertTo24Hour = (hour: string, minute: string, period: 'AM' | 'PM'): string => {
  let h = parseInt(hour);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${h.toString().padStart(2, '0')}:${minute}`;
};

export default function ConfigView() {
  const { config, isLoading, updateConfig } = useEventConfig();
  const [formData, setFormData] = useState({
    cumpleanera_nombre: '',
    evento_lugar: '',
    evento_fecha: '',
    evento_hora: ''
  });

  // Estado separado para el selector de hora 12h
  const [timeState, setTimeState] = useState<{ hour: string; minute: string; period: 'AM' | 'PM' }>({
    hour: '07',
    minute: '00',
    period: 'PM'
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
      // Convertir a formato 12h
      setTimeState(convertTo12Hour(config.evento_hora || '19:00'));
    }
  }, [config]);

  const handleTimeChange = (field: 'hour' | 'minute' | 'period', value: string) => {
    const newTimeState = { ...timeState, [field]: value };
    setTimeState(newTimeState);
    // Actualizar formData con hora en formato 24h
    const hora24 = convertTo24Hour(newTimeState.hour, newTimeState.minute, newTimeState.period as 'AM' | 'PM');
    setFormData({ ...formData, evento_hora: hora24 });
  };

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
        <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
          <div className="bg-indigo-500/20 p-3 rounded-2xl text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
            <Settings size={28} className="animate-spin-slow" />
          </div>
          Configuración Maestro
        </h2>
        <button
          onClick={handleSave}
          disabled={updateConfig.isPending || saved}
          className={`w-full md:w-auto px-10 py-5 rounded-[2rem] transition-all active:scale-95 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.2em] shadow-2xl ${
            saved 
            ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
            : 'premium-gradient text-white shadow-indigo-500/20 hover:shadow-indigo-500/40'
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
          className="bg-[#1E293B] p-10 rounded-[3rem] border border-slate-700/50 shadow-xl shadow-indigo-500/5 relative overflow-hidden group"
        >
          <div className="absolute right-[-20px] top-[-20px] p-8 opacity-10 text-indigo-400 group-hover:scale-110 transition-transform duration-700">
            <User size={180} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-500/20 p-3 rounded-2xl text-indigo-400 border border-indigo-500/30">
                <User size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Protagonista</span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-300 uppercase tracking-tighter">Nombre de la Cumpleañera</label>
              <input 
                type="text"
                value={formData.cumpleanera_nombre}
                onChange={(e) => setFormData({...formData, cumpleanera_nombre: e.target.value})}
                placeholder="Ej. Mamá Zara"
                className="w-full bg-slate-800/50 border-2 border-slate-600/50 rounded-2xl p-5 outline-none focus:border-indigo-500/50 transition-all font-bold text-white placeholder:text-slate-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Location Config */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-[#1E293B] p-10 rounded-[3rem] border border-slate-700/50 shadow-xl shadow-emerald-500/5 relative overflow-hidden group"
        >
          <div className="absolute right-[-20px] top-[-20px] p-8 opacity-10 text-emerald-400 group-hover:scale-110 transition-transform duration-700">
            <MapPin size={180} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500/20 p-3 rounded-2xl text-emerald-400 border border-emerald-500/30">
                <MapPin size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Ubicación</span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-300 uppercase tracking-tighter">Lugar del Evento</label>
              <input 
                type="text"
                value={formData.evento_lugar}
                onChange={(e) => setFormData({...formData, evento_lugar: e.target.value})}
                placeholder="Ej. Salón Cristal, Lima"
                className="w-full bg-slate-800/50 border-2 border-slate-600/50 rounded-2xl p-5 outline-none focus:border-emerald-500/50 transition-all font-bold text-white placeholder:text-slate-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Date Config */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-[#1E293B] p-10 rounded-[3rem] border border-slate-700/50 shadow-xl shadow-amber-500/5 relative overflow-hidden group"
        >
          <div className="absolute right-[-20px] top-[-20px] p-8 opacity-10 text-amber-400 group-hover:scale-110 transition-transform duration-700">
            <Calendar size={180} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-amber-500/20 p-3 rounded-2xl text-amber-400 border border-amber-500/30">
                <Calendar size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Fecha</span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-300 uppercase tracking-tighter">Día de la Celebración</label>
              <input 
                type="date"
                value={formData.evento_fecha}
                onChange={(e) => setFormData({...formData, evento_fecha: e.target.value})}
                className="w-full bg-slate-800/50 border-2 border-slate-600/50 rounded-2xl p-5 outline-none focus:border-amber-500/50 transition-all font-bold text-white [color-scheme:dark]"
              />
            </div>
          </div>
        </motion.div>

        {/* Time Config - 12h format */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-[#1E293B] p-10 rounded-[3rem] border border-slate-700/50 shadow-xl shadow-purple-500/5 relative overflow-hidden group"
        >
          <div className="absolute right-[-20px] top-[-20px] p-8 opacity-10 text-purple-400 group-hover:scale-110 transition-transform duration-700">
            <Clock size={180} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500/20 p-3 rounded-2xl text-purple-400 border border-purple-500/30">
                <Clock size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Horario</span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-300 uppercase tracking-tighter">Hora de Inicio</label>
              <div className="flex gap-3 items-center">
                {/* Hour */}
                <select
                  value={timeState.hour}
                  onChange={(e) => handleTimeChange('hour', e.target.value)}
                  className="flex-1 bg-slate-800/50 border-2 border-slate-600/50 rounded-2xl p-5 outline-none focus:border-purple-500/50 transition-all font-bold text-white appearance-none text-center cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <span className="text-2xl font-black text-slate-500">:</span>
                {/* Minute */}
                <select
                  value={timeState.minute}
                  onChange={(e) => handleTimeChange('minute', e.target.value)}
                  className="flex-1 bg-slate-800/50 border-2 border-slate-600/50 rounded-2xl p-5 outline-none focus:border-purple-500/50 transition-all font-bold text-white appearance-none text-center cursor-pointer"
                >
                  {['00', '15', '30', '45'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                {/* AM/PM */}
                <div className="flex rounded-2xl overflow-hidden border-2 border-slate-600/50">
                  <button
                    type="button"
                    onClick={() => handleTimeChange('period', 'AM')}
                    className={`px-5 py-5 font-black text-sm transition-all ${
                      timeState.period === 'AM' 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-slate-800/50 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeChange('period', 'PM')}
                    className={`px-5 py-5 font-black text-sm transition-all ${
                      timeState.period === 'PM' 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-slate-800/50 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-10 rounded-[3rem] border border-slate-700/50 overflow-hidden relative group">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-4 text-white">Misión Dashboard</h3>
          <p className="text-slate-400 text-sm leading-relaxed max-w-lg mb-8">
            Cualquier cambio aquí se reflejará instantáneamente en la pantalla principal y en la cuenta regresiva. Asegúrate de que los datos sean precisos para mantener a todos los invitados sincronizados.
          </p>
          <div className="flex gap-4">
            <div className="h-1 w-20 bg-amber-500 rounded-full"></div>
            <div className="h-1 w-10 bg-indigo-500 rounded-full"></div>
            <div className="h-1 w-5 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
        <div className="absolute right-[-5%] bottom-[-5%] opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000 text-indigo-400">
          <Settings size={220} />
        </div>
      </div>
    </div>
  );
}
