'use client';

import { Users, DollarSign, Calendar, MapPin, Armchair, Baby, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useEventConfig } from '@/hooks/useEventConfig';

export default function DashboardHeader({ resumen }: { resumen: any }) {
  const { config } = useEventConfig();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

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

    // Initial calc
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    setTimeLeft({
      days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
      mins: Math.max(0, Math.floor((diff / 1000 / 60) % 60)),
      secs: Math.max(0, Math.floor((diff / 1000) % 60))
    });

    return () => clearInterval(timer);
  }, [config.evento_fecha, config.evento_hora]);

  return (
    <header className="relative w-full bg-[#0F172A] min-h-[600px] overflow-hidden rounded-b-[4rem] font-body">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/30 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto h-full px-6 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Column Left: The Portrait Journey */}
          <div className="lg:col-span-5 relative group">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl"
            >
              <img 
                src="/hero.png" 
                alt={config.cumpleanera_nombre} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60"></div>
              
              {/* Floating Badge */}
              <div className="absolute bottom-10 left-10 right-10 p-6 glass-card rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl">
                 <p className="text-white/60 text-[10px] uppercase font-black tracking-widest mb-1">El Comienzo del Viaje</p>
                 <h3 className="text-white font-display text-2xl font-bold">{config.cumpleanera_nombre}</h3>
              </div>
            </motion.div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 border-t-2 border-r-2 border-amber-400/30 rounded-tr-[3rem] pointer-events-none"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border-b-2 border-l-2 border-indigo-400/30 rounded-bl-[3rem] pointer-events-none"></div>
          </div>

          {/* Column Right: Information & Pulse */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full mb-8"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                <span className="text-amber-400 text-[10px] font-black uppercase tracking-[0.25em]">Celebración {new Date(config.evento_fecha).getFullYear() || 2026}</span>
              </motion.div>
              
              <h1 className="font-display text-white text-6xl md:text-8xl font-black leading-none tracking-tight mb-6">
                 70 <span className="text-transparent bg-clip-text premium-gradient">AÑOS</span>
                 <br />
                 DE LUZ
              </h1>
              
              <p className="text-indigo-100/60 text-lg md:text-xl max-w-xl font-light leading-relaxed mb-10">
                 Un tributo a la vida, la sabiduría y el amor de {config.cumpleanera_nombre} en su septuagésimo aniversario. 
              </p>

              <div className="flex flex-wrap gap-6 items-center">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-amber-400">
                       <MapPin size={22} />
                    </div>
                    <div>
                       <p className="text-white font-bold text-sm tracking-tight uppercase">
                         {config.evento_lugar.includes(',') ? config.evento_lugar.split(',')[0] : config.evento_lugar}
                       </p>
                       <p className="text-white/40 text-[10px] font-medium tracking-widest uppercase">
                         {config.evento_lugar.includes(',') ? config.evento_lugar.split(',').slice(1).join(',').trim() : 'Ubicación del evento'}
                       </p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-indigo-400">
                       <Calendar size={22} />
                    </div>
                    <div>
                       <p className="text-white font-bold text-sm tracking-tight uppercase">
                          {new Date(config.evento_fecha + 'T00:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
                       </p>
                       <p className="text-white/40 text-[10px] font-medium tracking-widest uppercase">Gran Recepción • {config.evento_hora}</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Premium Countdown & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
               {/* Countdown Clock */}
               <div className="p-8 md:p-10 rounded-[3.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 text-white group-hover:scale-110 transition-transform duration-500">
                     <Clock size={48} />
                  </div>
                  <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-8">Cuenta Regresiva</p>
                  <div className="flex gap-4 md:gap-6 items-end justify-between md:justify-start">
                     <div className="text-center">
                        <span className="block text-4xl md:text-6xl font-black text-white leading-none mb-2">{timeLeft.days}</span>
                        <span className="text-[10px] text-indigo-200/50 uppercase font-black tracking-widest">Días</span>
                     </div>
                     <div className="text-center">
                        <span className="block text-4xl md:text-6xl font-black text-amber-400 leading-none mb-2">{timeLeft.hours}</span>
                        <span className="text-[10px] text-indigo-200/50 uppercase font-black tracking-widest">Horas</span>
                     </div>
                     <div className="text-center">
                        <span className="block text-4xl md:text-6xl font-black text-white/60 leading-none mb-2">{timeLeft.mins}</span>
                        <span className="text-[10px] text-indigo-200/50 uppercase font-black tracking-widest">Min</span>
                     </div>
                     <div className="text-center border-l border-white/10 pl-4 md:pl-6">
                        <span className="block text-4xl md:text-6xl font-black text-indigo-400 animate-pulse leading-none mb-2">
                           {timeLeft.secs < 10 ? `0${timeLeft.secs}` : timeLeft.secs}
                        </span>
                        <span className="text-[10px] text-indigo-200/50 uppercase font-black tracking-widest">Seg</span>
                     </div>
                  </div>
               </div>

               {/* Quick Stats Journey */}
               <div className="p-8 md:p-10 rounded-[3.5rem] bg-white/[0.03] border border-white/10 flex flex-col justify-between group">
                  <p className="text-indigo-200/40 text-[10px] font-black uppercase tracking-widest mb-6">Métricas de Control</p>
                  <div className="space-y-8">
                    {/* Confirmados Large */}
                    <div className="flex justify-between items-center gap-4">
                       <div className="flex items-center gap-4 md:gap-6">
                          <div className="p-3 md:p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
                             <Users size={32} />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-4xl md:text-5xl font-black text-white leading-none">{resumen.totalConfirmados}</span>
                             <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em] mt-1">Confirmados</span>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-4 border-l border-white/5 pl-4 md:pl-6">
                          <div className="text-right">
                             <span className="text-3xl md:text-4xl font-black text-amber-400 leading-none block mb-1">{resumen.totalPendientes}</span>
                             <span className="text-white/30 text-[9px] font-black uppercase tracking-widest">Pendientes</span>
                          </div>
                       </div>
                    </div>

                    {/* Progress Bar Larger */}
                    <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-[1px] border border-white/5">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${(resumen.totalConfirmados / Math.max(1, resumen.totalLista)) * 100}%` }}
                        />
                    </div>

                    {/* Presupuesto Large */}
                    <div className="flex items-center gap-4 md:gap-6 pt-2 border-t border-white/5">
                        <div className="p-3 md:p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                           <DollarSign size={32} />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-3xl md:text-4xl font-black text-white leading-none">
                              S/ {resumen.totalPagado.toLocaleString('es-PE')}
                           </span>
                           <span className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mt-1">Presupuesto Ejecutado</span>
                        </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aesthetic mask on bottom to blend with next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
    </header>
  );
}
