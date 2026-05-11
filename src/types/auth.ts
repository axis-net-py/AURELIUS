export type UserRole = 'owner' | 'manager' | 'operator'

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  farm_id: string | null
}

export interface AuthState {
  user: UserProfile | null
  session: any | null
  isLoading: boolean
  setUser: (user: UserProfile | null) => void
  setSession: (session: any | null) => void
  setLoading: (isLoading: boolean) => void
  signOut: () => Promise<void>
}
