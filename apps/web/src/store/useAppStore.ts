import { create } from 'zustand';

interface AppState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  modalType: 'guest' | 'expense' | 'task' | null;
  setModalType: (type: 'guest' | 'expense' | 'task' | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'invitados',
  setActiveTab: (tab) => set({ activeTab: tab }),
  isModalOpen: false,
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  editingId: null,
  setEditingId: (id) => set({ editingId: id }),
  modalType: null,
  setModalType: (type) => set({ modalType: type }),
}));
