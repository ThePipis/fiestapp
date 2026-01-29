'use client';

import { Users, DollarSign, Calendar, MapPin, Clock, ArrowUpRight, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useEventConfig } from '@/hooks/useEventConfig';

// --- DESIGN SYSTEM TOKENS (Anti-Generic Luxury) ---
// Typography: Mixing oversized serif (Playfair Display) with tech mono (JetBrains Mono)
// Colors: Deep Onyx, Champagne Gold, Ethereal Glass
const THEME = {
  colors: {
    bg: '#050505',
    card: 'rgba(255, 255, 255, 0.03)',
    cardHover: 'rgba(255, 255, 255, 0.08)',
    accent: '#D4AF37', // Champagne Gold
    success: '#10B981', // Emerald
    warning: '#F59E0B', // Amber
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.5)',
      tertiary: 'rgba(255, 255, 255, 0.3)'
    }
  }
};

export default function UltimateDashboard({ resumen }: { resumen: any }) {
  const { config } = useEventConfig();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Time Logic (Preserved)
  useEffect(() => {
    const targetDate = new Date(`${config.evento_fecha || '2026-05-23'}T${config.evento_hora || '00:00'}:00`);
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          mins: Math.floor((diff / 1000 / 60) % 60),
          secs: Math.floor((diff / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [config]);

  // Calculations for Conversion
  const progressPercent = Math.round((resumen.totalConfirmados / Math.max(1, resumen.totalLista)) * 100);
  const budgetPercent = Math.min(100, Math.round((resumen.totalPagado / Math.max(1, resumen.totalPresupuesto || 15000)) * 100)); // Assuming budget cap for viz

  return (
    <div className="min-h-screen bg-[#020202] text-white p-6 md:p-12 font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* --- HERO SECTION: The "Museum" Header --- */}
      <header className="relative mb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        {/* Typographic Art Title */}
        <div className="lg:col-span-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
           <h2 className="text-[#D4AF37] tracking-[0.5em] text-xs uppercase font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[#D4AF37]"></span>
              Admin Dashboard
            </h2>
            <h1 className="text-7xl md:text-9xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20 leading-[0.9]">
              {config.cumpleanera_nombre || 'MAMÁ ZARA'}
            </h1>
            <div className="h-0.5 w-32 bg-[#D4AF37] mt-8 mb-8"></div>
            
            <p className="text-xl md:text-2xl text-white/60 max-w-2xl font-light">
              Gestión maestra para la celebración de los <span className="text-white font-serif italic">70 años</span> de luz.
            </p>
          </motion.div>
        </div>

        {/* Quick Action / Status Chip */}
        <div className="lg:col-span-4 flex flex-col items-end justify-end space-y-4">
           <div className="bg-[#111] border border-white/10 px-6 py-3 rounded-full flex items-center gap-3 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs uppercase tracking-widest font-bold text-white/50">Sistema Activo</span>
              <span className="text-white font-mono text-sm">{new Date().toLocaleDateString('es-PE')}</span>
           </div>
        </div>
      </header>

      {/* --- KPI GRID: The "Conversion" Engine --- */}
      {/* Layout Grid that breaks the boring symmetry */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 grid-rows-[auto_auto]">
        
        {/* 1. MAIN COUNTDOWN (Span 8) - Visual Anchor */}
        <motion.div 
          className="md:col-span-8 relative group overflow-hidden bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-10 flex flex-col justify-between min-h-[400px]"
          whileHover={{ borderColor: 'rgba(255,255,255,0.1)' }}
        >
          {/* Background Gradient Animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative z-10 flex justify-between items-start">
             <div className="flex items-center gap-3 text-white/40">
                <Clock size={20} />
                <span className="text-xs uppercase tracking-[0.2em] font-bold">Tiempo Restante</span>
             </div>
             <div className="px-4 py-1 rounded-full border border-white/10 text-[10px] uppercase font-bold text-[#D4AF37]">
                {config.evento_fecha}
             </div>
          </div>

          <div className="relative z-10 grid grid-cols-4 gap-4 mt-auto">
             {[
               { val: timeLeft.days, label: 'DÍAS' },
               { val: timeLeft.hours, label: 'HORAS' },
               { val: timeLeft.mins, label: 'MIN' },
               { val: timeLeft.secs, label: 'SEG', highlight: true }
             ].map((item, i) => (
               <div key={i} className={`text-center ${i !== 3 ? 'border-r border-white/5' : ''}`}>
                  <span className={`block text-6xl md:text-8xl font-serif leading-none ${item.highlight ? 'text-[#D4AF37]' : 'text-white'}`}>
                    {item.val < 10 ? `0${item.val}` : item.val}
                  </span>
                  <span className="text-[10px] md:text-xs text-white/30 tracking-[0.4em] font-bold mt-2 block pl-1">
                    {item.label}
                  </span>
               </div>
             ))}
          </div>
        </motion.div>

        {/* 2. GUEST CONVERSION CARD (Span 4) - Vertical Focus */}
        <motion.div 
          className="md:col-span-4 bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-between group"
          whileHover={{ y: -5 }}
        >
           <div className="absolute top-0 right-0 p-[20%] bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none"></div>

           <div className="flex justify-between items-start">
             <div>
               <div className="text-white/40 mb-1 flex items-center gap-2">
                 <Users size={18} />
                 <span className="text-[10px] uppercase tracking-widest font-bold">Asistencia</span>
               </div>
               <h3 className="text-5xl font-sans font-bold text-white mt-4">{resumen.totalConfirmados}</h3>
               <p className="text-emerald-400 text-sm font-medium flex items-center gap-1 mt-1">
                 <ArrowUpRight size={14} /> Confirmados
               </p>
             </div>
             {/* Progress Circle (CSS Only) */}
             <div className="relative w-16 h-16 rounded-full border-4 border-white/5 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-emerald-500"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={`${progressPercent}, 100`}
                  />
                </svg>
                <span className="text-xs font-bold">{progressPercent}%</span>
             </div>
           </div>

           <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-xs text-white/40 font-medium">PENDIENTES</span>
                 <span className="text-xl font-serif text-[#D4AF37]">{resumen.totalPendientes}</span>
              </div>
              <p className="text-[10px] text-white/30 leading-relaxed">
                 Acción Requerida: Enviar recordatorios a los {resumen.totalPendientes} invitados pendientes antes del {new Date().toLocaleDateString()}.
              </p>
           </div>
        </motion.div>

        {/* 3. BUDGET CONTROL (Span 6) - Financial Health */}
        <motion.div 
          className="md:col-span-6 bg-gradient-to-br from-[#0A0A0A] to-[#050505] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group"
        >
           <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3 text-white/40">
                <DollarSign size={18} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Presupuesto</span>
              </div>
              <div className="px-3 py-1 bg-white/5 rounded-lg text-[10px] text-white/60">
                 S/ CAP: NO DEFINIDO
              </div>
           </div>

           <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-6xl font-sans font-bold text-white tracking-tight">
                 S/ {resumen.totalPagado.toLocaleString('es-PE')}
              </span>
              <span className="text-sm text-white/40 font-medium">EJECUTADO</span>
           </div>

           <div className="w-full h-1 bg-white/10 mt-8 mb-4 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full" 
                style={{ width: `${budgetPercent}%` }}
              ></div>
           </div>
           
           <div className="flex gap-8">
              <div>
                 <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Pagado</p>
                 <p className="text-white font-mono text-sm">Now</p>
              </div>
              <div>
                 <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Pendiente Gasto</p>
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    <p className="text-white font-mono text-sm">Calculando...</p>
                 </div>
              </div>
           </div>
        </motion.div>

        {/* 4. LOCATION & LOGISTICS (Span 6) - Action Center */}
        <motion.div 
          className="md:col-span-6 bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-0 relative overflow-hidden flex"
        >
           <div className="w-1/3 bg-white/5 border-r border-white/5 p-8 flex flex-col justify-center items-center text-center gap-4">
              <MapPin size={32} className="text-[#D4AF37]" />
              <div className="h-px w-8 bg-white/10"></div>
              <span className="text-xs uppercase tracking-widest font-bold text-white/50">Lugar</span>
           </div>
           <div className="w-2/3 p-8 flex flex-col justify-center">
              <h3 className="text-2xl text-white font-serif mb-2">
                {config.evento_lugar.split(',')[0]}
              </h3>
              <p className="text-white/40 text-sm mb-6">
                {config.evento_lugar.split(',').slice(1).join(',')}
              </p>
              <button className="self-start text-[10px] uppercase font-bold tracking-[0.2em] text-[#D4AF37] border border-[#D4AF37] px-6 py-3 rounded-none hover:bg-[#D4AF37] hover:text-black transition-colors">
                 Ver Mapa Logístico
              </button>
           </div>
        </motion.div>

      </div>
      
      {/* Decorative Footer */}
      <div className="mt-20 border-t border-white/5 pt-8 flex justify-between items-center text-white/20 text-xs font-mono">
         <span>FiestApp Design System v2.0 (Anti-Generic)</span>
         <span>SECURE • ENCRYPTED • PRIVATE</span>
      </div>
    </div>
  );
}
