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

const revenueSchema = z.object({
  date: z.string(),
  amount: z.string().min(1, "O valor é obrigatório"),
  commodity: z.string().min(1, "A commodity é obrigatória"),
  buyer: z.string().optional(),
  qty: z.string().optional(),
})

type RevenueFormValues = z.infer<typeof revenueSchema>

interface NewRevenueFormProps {
  onSuccess: () => void
}

export const NewRevenueForm: React.FC<NewRevenueFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { t } = useTranslation()

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RevenueFormValues>({
    resolver: zodResolver(revenueSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    }
  })

  const onSubmit = async (data: RevenueFormValues) => {
    setIsLoading(true)
    try {
      console.log("Saving revenue:", data)
      await new Promise(resolve => setTimeout(resolve, 1000))
      onSuccess()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input id="date" type="date" {...register('date')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Valor Total (R$)</Label>
          <Input id="amount" type="number" step="0.01" placeholder="0,00" {...register('amount')} />
          {errors.amount && <p className="text-xs text-rose-500">{errors.amount.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="commodity">Commodity</Label>
        <Select onValueChange={(v) => setValue('commodity', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o produto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="soy">Soja</SelectItem>
            <SelectItem value="corn">Milho</SelectItem>
            <SelectItem value="wheat">Trigo</SelectItem>
            <SelectItem value="cotton">Algodão</SelectItem>
            <SelectItem value="other">Outros</SelectItem>
          </SelectContent>
        </Select>
        {errors.commodity && <p className="text-xs text-rose-500">{errors.commodity.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="buyer">Comprador</Label>
        <Input id="buyer" placeholder="Nome do comprador" {...register('buyer')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice">Nota Fiscal</Label>
        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
          <div className="flex flex-col items-center">
            <Camera className="h-8 w-8 text-muted-foreground group-hover:text-accent transition-colors" />
            <span className="text-xs text-muted-foreground mt-2 font-medium">Tirar foto ou anexar</span>
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
