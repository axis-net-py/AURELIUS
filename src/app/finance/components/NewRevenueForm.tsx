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
import { supabase } from '@/lib/supabase'

const revenueSchema = z.object({
  date: z.string(),
  amount: z.string().min(1, "O valor é obrigatório"),
  commodity: z.string().min(1, "A commodity é obrigatória"),
  buyer: z.string().optional(),
  qty: z.string().optional(),
  currency: z.enum(['BRL', 'USD', 'PYG']),
})

type RevenueFormValues = z.infer<typeof revenueSchema>

interface NewRevenueFormProps {
  onSuccess: () => void
}

export const NewRevenueForm: React.FC<NewRevenueFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { t } = useTranslation()
  const { currency: globalCurrency } = useCurrencyStore()
  const [selectedCurrency, setSelectedCurrency] = React.useState<Currency>(globalCurrency)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RevenueFormValues>({
    resolver: zodResolver(revenueSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      currency: globalCurrency,
    }
  })

  const onSubmit = async (data: RevenueFormValues) => {
    setIsLoading(true)
    try {
      // Convert amount to BRL for storage
      const amountBRL = selectedCurrency === 'BRL'
        ? parseFloat(data.amount)
        : parseFloat(data.amount) / EXCHANGE_RATES[selectedCurrency]

      const { error } = await supabase
        .from('revenues')
        .insert({
          date: data.date,
          amount: amountBRL,
          currency_input: selectedCurrency,
          amount_input: parseFloat(data.amount),
          commodity: data.commodity,
          buyer: data.buyer || null,
          qty: data.qty ? parseFloat(data.qty) : null,
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
        <Label htmlFor="commodity">{t('finance.commodity')}</Label>
        <Select onValueChange={(v) => setValue('commodity', v)}>
          <SelectTrigger>
            <SelectValue placeholder={t('finance.commodity')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="soy">{t('finance.commodities.soy')}</SelectItem>
            <SelectItem value="corn">{t('finance.commodities.corn')}</SelectItem>
            <SelectItem value="wheat">{t('finance.commodities.wheat')}</SelectItem>
            <SelectItem value="cotton">{t('finance.commodities.cotton')}</SelectItem>
            <SelectItem value="other">{t('finance.commodities.other')}</SelectItem>
          </SelectContent>
        </Select>
        {errors.commodity && <p className="text-xs text-rose-500">{errors.commodity.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="buyer">{t('finance.buyer')}</Label>
        <Input id="buyer" placeholder={t('finance.buyer')} {...register('buyer')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice">{t('finance.invoice')}</Label>
        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
          <div className="flex flex-col items-center">
            <Camera className="h-8 w-8 text-muted-foreground group-hover:text-accent transition-colors" />
            <span className="text-xs text-muted-foreground mt-2 font-medium">{t('common.attach_photo')}</span>
          </div>
          <input id="invoice" type="file" className="hidden" accept="image/*" />
        </div>
      </div>

      <div className="pt-4 flex gap-2">
        <Button type="submit" className="flex-1 rounded-xl h-12 bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : t('actions.save')}
        </Button>
      </div>
    </form>
  )
}
