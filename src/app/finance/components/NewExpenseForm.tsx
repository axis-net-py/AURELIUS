import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Loader2, Camera } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCurrencyStore } from '@/store/useCurrencyStore'
import { CURRENCY_CONFIG, type Currency, EXCHANGE_RATES } from '@/lib/currency'
import { toast } from 'sonner'

const expenseSchema = z.object({
  date: z.string(),
  amount: z.string().min(1, "O valor é obrigatório"),
  category: z.string().min(1, "A categoria é obrigatória"),
  supplier: z.string().optional(),
  notes: z.string().optional(),
  currency: z.enum(['BRL', 'USD', 'PYG']),
})

type ExpenseFormValues = z.infer<typeof expenseSchema>

interface NewExpenseFormProps {
  onSuccess: () => void
}

export const NewExpenseForm: React.FC<NewExpenseFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { t } = useTranslation()
  const { currency: globalCurrency } = useCurrencyStore()
  const [selectedCurrency, setSelectedCurrency] = React.useState<Currency>(globalCurrency)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      currency: globalCurrency,
    }
  })

  const onSubmit = async (data: ExpenseFormValues) => {
    setIsLoading(true)
    try {
      const { supabase } = await import('@/lib/supabase')

      // Convert amount to BRL for storage
      const amountBRL = selectedCurrency === 'BRL'
        ? parseFloat(data.amount)
        : parseFloat(data.amount) / EXCHANGE_RATES[selectedCurrency]

      const { error } = await supabase
        .from('expenses')
        .insert({
          date: data.date,
          amount: amountBRL,
          currency_input: selectedCurrency,
          amount_input: parseFloat(data.amount),
          category: data.category,
          supplier: data.supplier || null,
          notes: data.notes || null,
        })

    if (error) throw error

    toast.success(t('common.saved'))
    onSuccess()
  } catch (error) {
    console.error(error)
    toast.error(t('common.error'))
  } finally {
    setIsLoading(false)
  }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">{t('finance.date')}</Label>
          <Input id="date" type="date" {...register('date')} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="amount">{t('finance.amount')}</Label>
            <div className="flex items-center bg-muted rounded-full p-0.5 gap-0.5">
              {(['BRL','USD','PYG'] as Currency[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setSelectedCurrency(c)
                    setValue('currency', c)
                  }}
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCurrency === c
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {CURRENCY_CONFIG[c].flag} {c}
                </button>
              ))}
            </div>
          </div>
          <Input id="amount" type="number" step="0.01" placeholder="0,00" {...register('amount')} />
          {errors.amount && <p className="text-xs text-rose-500">{errors.amount.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">{t('finance.category')}</Label>
        <Select onValueChange={(v) => setValue('category', v)}>
          <SelectTrigger>
            <SelectValue placeholder={t('finance.category')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seeds">{t('finance.categories.seeds')}</SelectItem>
            <SelectItem value="fertilizer">{t('finance.categories.fertilizer')}</SelectItem>
            <SelectItem value="pesticide">{t('finance.categories.pesticide')}</SelectItem>
            <SelectItem value="fuel">{t('finance.categories.fuel')}</SelectItem>
            <SelectItem value="maintenance">{t('finance.categories.maintenance')}</SelectItem>
            <SelectItem value="labor">{t('finance.categories.labor')}</SelectItem>
            <SelectItem value="other">{t('finance.categories.other')}</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && <p className="text-xs text-rose-500">{errors.category.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplier">{t('finance.supplier')}</Label>
        <Input id="supplier" placeholder={t('finance.supplier')} {...register('supplier')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="receipt">{t('finance.receipt')}</Label>
        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
          <div className="flex flex-col items-center">
            <Camera className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-xs text-muted-foreground mt-2 font-medium">{t('common.attach_photo')}</span>
          </div>
          <input id="receipt" type="file" className="hidden" accept="image/*" />
        </div>
      </div>

      <div className="pt-4 flex gap-2">
        <Button type="submit" className="flex-1 rounded-xl h-12" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('actions.save')}
        </Button>
      </div>
    </form>
  )
}
