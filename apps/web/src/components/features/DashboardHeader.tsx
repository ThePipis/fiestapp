'use client';

import { Users, DollarSign, Calendar, MapPin, Armchair, Baby } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardHeader({ resumen }: { resumen: any }) {
  return (
    <header className="premium-gradient text-white p-6 md:p-10 shadow-2xl relative overflow-hidden rounded-b-[3rem]">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <div className="bg-amber-400 p-4 rounded-3xl text-indigo-900 shadow-2xl shadow-amber-400/30 transform -rotate-6">
              <Calendar size={40} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none mb-2">Zara: 70 Años</h1>
              <p className="text-indigo-100/80 text-sm md:text-base font-medium flex items-center gap-2">
                <MapPin size={18} className="text-amber-400" /> Rímac, Lima • 23 Mayo 2026
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            title="Total Lista" 
            value={resumen.totalLista} 
            subtitle="Personas en lista" 
            icon={<Users size={24} />} 
          />
          <StatCardMulti 
            items={[
              { label: 'Adultos', value: resumen.totalAdultosLista, icon: <Armchair size={18} />, color: 'text-indigo-200' },
              { label: 'Niños', value: resumen.totalNinosLista, icon: <Baby size={18} />, color: 'text-amber-400' }
            ]}
          />
          <StatCard 
            title="Confirmados" 
            value={resumen.totalConfirmados} 
            subtitle={`${resumen.totalPendientes} Pendientes`} 
            color="text-emerald-400"
            icon={<Users size={24} />} 
          />
          <StatCard 
            title="Presupuesto" 
            value={`S/ ${resumen.presupuestoTotal.toFixed(2)}`} 
            subtitle="Estimado total" 
            icon={<DollarSign size={24} />} 
            premium
          />
        </div>
      </div>
    </header>
  );
}

function StatCard({ title, value, subtitle, icon, color = "text-white", premium = false }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`p-6 rounded-[2.5rem] border border-white/10 flex flex-col justify-between transition-all ${premium ? 'bg-white/20 backdrop-blur-xl shadow-xl' : 'bg-white/5 backdrop-blur-md'}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="bg-white/10 p-2.5 rounded-2xl">{icon}</div>
        <span className="text-[10px] uppercase font-black tracking-widest text-indigo-200 opacity-70">{title}</span>
      </div>
      <div>
        <span className={`text-3xl md:text-4xl font-black tracking-tight ${color}`}>{value}</span>
        <p className="text-[10px] font-bold text-indigo-200/60 mt-1 uppercase tracking-wider">{subtitle}</p>
      </div>
    </motion.div>
  );
}

function StatCardMulti({ items }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10 flex flex-col justify-center gap-4"
    >
      {items.map((item: any, i: number) => (
        <div key={item.label} className={`flex items-center justify-between ${i === 0 ? 'border-b border-white/10 pb-4' : 'pt-2'}`}>
          <div className="flex items-center gap-3">
            <span className={item.color}>{item.icon}</span>
            <span className="text-xs font-black uppercase tracking-widest text-indigo-100">{item.label}</span>
          </div>
          <span className={`text-2xl font-black ${item.color}`}>{item.value}</span>
        </div>
      ))}
    </motion.div>
  );
}
