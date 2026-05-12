import { supabase } from '@/lib/supabase'
import type { Season } from '@/types/farm'

export const seasonService = {
  async getSeasons(farmId: string) {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .eq('farm_id', farmId)
      .order('start_date', { ascending: false })

    if (error) throw error
    return data as Season[]
  },

  async createSeason(season: Omit<Season, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('seasons')
      .insert([season])
      .select()
      .single()

    if (error) throw error
    return data as Season
  },

  async updateSeason(id: string, season: Partial<Omit<Season, 'id' | 'created_at' | 'farm_id'>>) {
    const { data, error } = await supabase
      .from('seasons')
      .update(season)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Season
  },

  async deleteSeason(id: string) {
    const { error } = await supabase
      .from('seasons')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
