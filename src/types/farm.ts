export type FieldStatus = 'active' | 'inactive'

export interface Field {
  id: string
  farm_id: string
  name: string
  area: number
  crop: string
  status: FieldStatus
  created_at?: string
}

export type SeasonStatus = 'planned' | 'active' | 'harvested' | 'closed'

export interface Season {
  id: string
  farm_id: string
  name: string
  crop: string
  start_date: string
  status: SeasonStatus
  created_at?: string
}

export type MachineryStatus = 'operational' | 'maintenance' | 'broken'

export interface Machinery {
  id: string
  farm_id: string
  name: string
  type: string
  hours?: number
  km?: number
  last_maintenance?: string
  status: MachineryStatus
  created_at?: string
}

export type InventoryCategory = 'SEEDS' | 'CHEMICALS' | 'FERTILIZERS'

export interface InventoryItem {
  id: string
  farm_id: string
  item_name: string
  category: InventoryCategory
  quantity: number
  unit: string
  min_threshold: number
  created_at?: string
}
