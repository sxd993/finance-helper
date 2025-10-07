import { create } from "zustand";

// Типы вкладок
export type TransactionTab = "income" | "expense";

interface TransactionModalState {
  isOpen: boolean;
  activeTab: TransactionTab;
  tabs: TransactionTab[];
  openModal: (tab?: TransactionTab) => void;
  closeModal: () => void;
  setTab: (tab: TransactionTab) => void;
}

export const useTransactionModal = create<TransactionModalState>((set) => ({
  isOpen: false,
  activeTab: "income",
  tabs: ["income", "expense"],

  openModal: (tab) =>
    set(() => ({
      isOpen: true,
      activeTab: tab ?? "income",
    })),

  closeModal: () => set({ isOpen: false }),
  setTab: (tab) => set({ activeTab: tab }),
}));
