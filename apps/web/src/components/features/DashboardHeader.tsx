'use client';

import { Users, DollarSign, Calendar, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useEventConfig } from '@/hooks/useEventConfig';

const DEFAULT_CONFIG = {
  cumpleanera_nombre: 'Mamá Zara',
  evento_lugar: 'Lima, Perú',
  evento_fecha: '2026-05-23',
  evento_hora: '19:00'
};

export default function DashboardHeader({ resumen }: { resumen: any }) {
  const { config } = useEventConfig();
  const [renderConfig, setRenderConfig] = useState(DEFAULT_CONFIG);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [eventYear, setEventYear] = useState(2026);
  const [eventDateLabel, setEventDateLabel] = useState(DEFAULT_CONFIG.evento_fecha);

  useEffect(() => {
    setRenderConfig(config || DEFAULT_CONFIG);
  }, [config]);

  useEffect(() => {
    const fecha = renderConfig.evento_fecha || DEFAULT_CONFIG.evento_fecha;
    const hora = renderConfig.evento_hora || DEFAULT_CONFIG.evento_hora;
    const targetDate = new Date(`${fecha}T${hora}:00`);
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

    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    setTimeLeft({
      days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
      mins: Math.max(0, Math.floor((diff / 1000 / 60) % 60)),
      secs: Math.max(0, Math.floor((diff / 1000) % 60))
    });

    return () => clearInterval(timer);
  }, [renderConfig.evento_fecha, renderConfig.evento_hora]);

  useEffect(() => {
    const fecha = renderConfig.evento_fecha || DEFAULT_CONFIG.evento_fecha;
    const date = new Date(`${fecha}T00:00:00`);
    if (!Number.isNaN(date.getTime())) {
      setEventYear(date.getFullYear());
      setEventDateLabel(
        new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)
      );
    } else {
      setEventYear(2026);
      setEventDateLabel(DEFAULT_CONFIG.evento_fecha);
    }
  }, [renderConfig.evento_fecha]);

  return (
    <header className="relative w-full bg-[#0F172A] min-h-[600px] overflow-hidden rounded-b-[4rem] font-body">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/30 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Column Left: The Portrait */}
          <div className="lg:col-span-5 relative group">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl"
            >
              <img 
                src="/hero.png" 
                alt={renderConfig.cumpleanera_nombre} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                suppressHydrationWarning
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60"></div>
              
              {/* Floating Badge */}
              <div className="absolute bottom-10 left-10 right-10 p-6 rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl">
                 <p className="text-white/60 text-[10px] uppercase font-black tracking-widest mb-1">El Comienzo del Viaje</p>
                 <h3 className="text-white font-display text-2xl font-bold">{renderConfig.cumpleanera_nombre}</h3>
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
                <span className="text-amber-400 text-[10px] font-black uppercase tracking-[0.25em]">Celebración {eventYear}</span>
              </motion.div>
              
              <h1 className="font-display text-white text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-6">
                 70 <span className="text-transparent bg-clip-text premium-gradient">AÑOS</span>
                 <br />
                 DE LUZ
              </h1>
              
              <p className="text-indigo-100/60 text-lg md:text-xl max-w-xl font-light leading-relaxed mb-10">
                 Un tributo a la vida, la sabiduría y el amor de {renderConfig.cumpleanera_nombre} en su septuagésimo aniversario. 
              </p>

              <div className="flex flex-wrap gap-6 items-center">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-amber-400">
                       <MapPin size={22} />
                    </div>
                    <div>
                       <p className="text-white font-bold text-sm tracking-tight uppercase">
                         {renderConfig.evento_lugar.includes(',') ? renderConfig.evento_lugar.split(',')[0] : renderConfig.evento_lugar}
                       </p>
                       <p className="text-white/40 text-[10px] font-medium tracking-widest uppercase">
                         {renderConfig.evento_lugar.includes(',') ? renderConfig.evento_lugar.split(',').slice(1).join(',').trim() : 'Ubicación del evento'}
                       </p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-indigo-400">
                       <Calendar size={22} />
                    </div>
                    <div>
                       <p className="text-white font-bold text-sm tracking-tight uppercase">{eventDateLabel}</p>
                       <p className="text-white/40 text-[10px] font-medium tracking-widest uppercase">Gran Recepción • {renderConfig.evento_hora}</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Premium Countdown & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Countdown Clock */}
               <div className="p-6 md:p-8 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-4 right-4 opacity-10 text-white pointer-events-none">
                     <Clock size={48} />
                  </div>
                  <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-6">Cuenta Regresiva</p>
                  <div className="grid grid-cols-4 gap-2 md:gap-4">
                     <div className="text-center">
                        <span className="block text-2xl md:text-4xl lg:text-5xl font-black text-white leading-none mb-1">{timeLeft.days}</span>
                        <span className="text-[8px] md:text-[10px] text-indigo-200/50 uppercase font-black tracking-widest">Días</span>
                     </div>
                     <div className="text-center">
                        <span className="block text-2xl md:text-4xl lg:text-5xl font-black text-amber-400 leading-none mb-1">{timeLeft.hours}</span>
                        <span className="text-[8px] md:text-[10px] text-indigo-200/50 uppercase font-black tracking-widest">Horas</span>
                     </div>
                     <div className="text-center">
                        <span className="block text-2xl md:text-4xl lg:text-5xl font-black text-white/60 leading-none mb-1">{timeLeft.mins}</span>
                        <span className="text-[8px] md:text-[10px] text-indigo-200/50 uppercase font-black tracking-widest">Min</span>
                     </div>
                     <div className="text-center border-l border-white/10 pl-2 md:pl-4">
                        <span className="block text-2xl md:text-4xl lg:text-5xl font-black text-indigo-400 animate-pulse leading-none mb-1">
                           {timeLeft.secs < 10 ? `0${timeLeft.secs}` : timeLeft.secs}
                        </span>
                        <span className="text-[8px] md:text-[10px] text-indigo-200/50 uppercase font-black tracking-widest">Seg</span>
                     </div>
                  </div>
               </div>

               {/* Quick Stats */}
               <div className="p-6 md:p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 flex flex-col gap-6 overflow-hidden">
                  <p className="text-indigo-200/40 text-[10px] font-black uppercase tracking-widest">Métricas de Control</p>
                  
                  {/* Confirmados Row */}
                  <div className="flex items-center justify-between gap-4">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 flex-shrink-0">
                           <Users size={24} />
                        </div>
                        <div>
                           <span className="text-3xl md:text-4xl font-black text-white leading-none">{resumen.totalConfirmados}</span>
                           <span className="block text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-1">Confirmados</span>
                        </div>
                     </div>
                     <div className="text-right border-l border-white/10 pl-4">
                        <span className="text-2xl md:text-3xl font-black text-amber-400 leading-none">{resumen.totalPendientes}</span>
                        <span className="block text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Pendientes</span>
                     </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/5 h-2 md:h-3 rounded-full overflow-hidden border border-white/5">
                     <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(resumen.totalConfirmados / Math.max(1, resumen.totalLista)) * 100}%` }}
                     />
                  </div>

                  {/* Presupuesto Row */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                     <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 flex-shrink-0">
                        <DollarSign size={24} />
                     </div>
                     <div>
                        <span className="text-2xl md:text-3xl font-black text-white leading-none">
                           S/ {resumen.totalPagado.toLocaleString('es-PE')}
                        </span>
                        <span className="block text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-1">Presupuesto Ejecutado</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aesthetic mask on bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0F172A] to-transparent pointer-events-none"></div>
    </header>
  );
}
