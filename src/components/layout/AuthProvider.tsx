import React, { createContext, useContext, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'


const AuthContext = createContext({})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUser, setSession, setLoading } = useAuthStore()

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      // In a real app, you'd fetch from your 'user_roles' and 'profiles' table
      // For Phase 1, we'll mock the role as 'owner' if user exists
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, farm_id')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        // Default to owner for first user or debugging
        setUser({ id: userId, email: '', role: 'owner', farm_id: null })
      } else {
        setUser({ id: userId, email: '', role: data.role, farm_id: data.farm_id })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
