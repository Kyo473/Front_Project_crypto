import { create } from 'zustand';
import type { Trade } from '../types';

interface TradeStore {
  trades: Trade[];
  addTrade: (trade: Trade) => void;
  clearTrades: () => void;
}

type TradeStoreState = {
  trades: Trade[];
};

type TradeStoreActions = {
  addTrade: (trade: Trade) => void;
  clearTrades: () => void;
};

export const useTradeStore = create<TradeStore>((set) => ({
  trades: [],
  addTrade: (trade: Trade) => set((state: TradeStoreState) => ({ 
    trades: [...state.trades, trade] 
  })),
  clearTrades: () => set({ trades: [] }),
}));
