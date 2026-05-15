import { create } from 'zustand'
import type { AuthState } from '@/types/auth'
import { supabase } from '@/lib/supabase'

export const useAuthStore = create<AuthState>((set) => ({

  user: null,
  session: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null })
  },
}))
