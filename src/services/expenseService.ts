import { supabase } from '@/lib/supabase';

export interface Expense {
  id: string;
  farm_id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  field_id?: string;
}

export const expenseService = {
  createExpense: async (expense: Omit<Expense, 'id'>) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense]);
    if (error) throw error;
    return data;
  }
};
