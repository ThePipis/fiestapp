'use client';

import { Users, DollarSign, ClipboardList, Sparkles, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

const TABS = [
  { id: 'invitados', label: 'Invitados', icon: Users },
  { id: 'presupuesto', label: 'Presupuesto', icon: DollarSign },
  { id: 'logistica', label: 'Logística', icon: ClipboardList },
  { id: 'asistente', label: 'Asistente ✨', icon: Sparkles },
  { id: 'consola', label: 'Configuración 🛠️', icon: Database }
];

export default function TabNavigation() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <div className="max-w-7xl mx-auto -mt-10 px-6 relative z-20 mb-12">
      <nav className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-2.5 flex gap-2 border border-white overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-3 py-5 px-8 rounded-3xl text-[11px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap relative group ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTabBadge"
                  className="absolute inset-0 premium-gradient rounded-3xl shadow-xl shadow-indigo-200"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                <tab.icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'} />
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
