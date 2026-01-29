'use client';

import { Users, DollarSign, ClipboardList, Sparkles, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

const TABS = [
  { id: 'invitados', label: 'Invitados', icon: Users, color: 'bg-indigo-500' },
  { id: 'presupuesto', label: 'Presupuesto', icon: DollarSign, color: 'bg-emerald-500' },
  { id: 'logistica', label: 'Logística', icon: ClipboardList, color: 'bg-amber-500' },
  { id: 'asistente', label: 'AI Zara', icon: Sparkles, color: 'bg-fuchsia-500' },
  { id: 'consola', label: 'Config', icon: LayoutGrid, color: 'bg-slate-500' }
];

export default function TabNavigation() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <nav className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl shadow-indigo-900/10 rounded-[2.5rem] p-2 flex items-center gap-1 max-w-full overflow-x-auto no-scrollbar ring-1 ring-slate-900/5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-3 px-5 py-4 rounded-[2rem] transition-all duration-300 group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${ 
                isActive ? '' : 'hover:bg-slate-50 active:scale-95'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-[#0F172A] rounded-[2rem] shadow-lg"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              
              <div className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
                <tab.icon size={22} className="stroke-[2.5px]" />
              </div>
              
              <AnimatePresence mode="popLayout">
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, width: 0, x: -10 }}
                    animate={{ opacity: 1, width: 'auto', x: 0 }}
                    exit={{ opacity: 0, width: 0, x: -10 }}
                    className="relative z-10 text-xs font-black uppercase tracking-wider text-white whitespace-nowrap overflow-hidden pr-2"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
