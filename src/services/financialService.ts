import { supabase } from '@/lib/supabase';

export interface FinancialSummary {
  crop_season_id: string;
  farm_id: string;
  season_name: string;
  input_costs: number;
  maintenance_costs: number;
  fuel_costs: number;
  total_costs: number;
  total_revenue: number;
  profit: number;
}

export const financialService = {
  getSummary: async (farmId: string): Promise<FinancialSummary[]> => {
    if (!supabase || !farmId) return [];
    
    const { data, error } = await supabase
      .from('financial_summary')
      .select('*')
      .eq('farm_id', farmId);
      
    if (error) {
      console.error('Error fetching financial summary:', error);
      return [];
    }
    
    return data || [];
  }
};
