import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Currency } from '@/lib/currency'

interface CurrencyStore {
  currency: Currency
  setCurrency: (c: Currency) => void
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: 'BRL',
      setCurrency: (currency) => set({ currency }),
    }),
    { name: 'preferred-currency' }
  )
)
