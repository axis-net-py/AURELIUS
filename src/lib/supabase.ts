import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create client - will fail gracefully at runtime if credentials are invalid
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if configured
export const isSupabaseConfigured = () => !!(supabaseUrl && supabaseAnonKey)