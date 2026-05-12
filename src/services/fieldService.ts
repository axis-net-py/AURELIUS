import { supabase } from '@/lib/supabase'
import type { Field } from '@/types/farm'

export const fieldService = {
  async getFields(farmId: string) {
    const { data, error } = await supabase
      .from('fields')
      .select('*')
      .eq('farm_id', farmId)
      .order('name', { ascending: true })

    if (error) throw error
    return data as Field[]
  },

  async createField(field: Omit<Field, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('fields')
      .insert([field])
      .select()
      .single()

    if (error) throw error
    return data as Field
  },

  async updateField(id: string, field: Partial<Omit<Field, 'id' | 'created_at' | 'farm_id'>>) {
    const { data, error } = await supabase
      .from('fields')
      .update(field)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Field
  },

  async deleteField(id: string) {
    const { error } = await supabase
      .from('fields')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
