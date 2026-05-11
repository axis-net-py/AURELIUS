import { supabase } from '@/lib/supabase'

export const fetchSeasons = async (farmId: string) => {
  const { data, error } = await supabase
    .from('crop_seasons')
    .select('*')
    .eq('farm_id', farmId)
    .order('start_date', { ascending: false })
  
  if (error) throw error
  return data
}

export const createSeason = async (season: any) => {
  const { data, error } = await supabase
    .from('crop_seasons')
    .insert([season])
    .select()
    .single()
  
  if (error) throw error
  return data
}
