'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModalContainer({ title, children }: { title: string, children: ReactNode }) {
  const { isModalOpen, setIsModalOpen } = useAppStore();

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <AnimatePresence>
        {isModalOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]" 
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl p-10 z-[101] border border-slate-100 outline-none"
              >
                <div className="flex justify-between items-center mb-8">
                  <Dialog.Title className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                    {title}
                  </Dialog.Title>
                  <Dialog.Close className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                    <X size={24} />
                  </Dialog.Close>
                </div>
                {children}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
