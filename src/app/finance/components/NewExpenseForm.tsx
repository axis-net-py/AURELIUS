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

const expenseSchema = z.object({
  date: z.string(),
  amount: z.string().min(1, "O valor é obrigatório"),
  category: z.string().min(1, "A categoria é obrigatória"),
  supplier: z.string().optional(),
  notes: z.string().optional(),
})

type ExpenseFormValues = z.infer<typeof expenseSchema>

interface NewExpenseFormProps {
  onSuccess: () => void
}

export const NewExpenseForm: React.FC<NewExpenseFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { t } = useTranslation()

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    }
  })

  const onSubmit = async (data: ExpenseFormValues) => {
    setIsLoading(true)
    try {
      console.log("Saving expense:", data)
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
          <Label htmlFor="amount">Valor (R$)</Label>
          <Input id="amount" type="number" step="0.01" placeholder="0,00" {...register('amount')} />
          {errors.amount && <p className="text-xs text-rose-500">{errors.amount.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select onValueChange={(v) => setValue('category', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seeds">Sementes</SelectItem>
            <SelectItem value="fertilizer">Fertilizantes</SelectItem>
            <SelectItem value="pesticide">Defensivos</SelectItem>
            <SelectItem value="fuel">Combustível</SelectItem>
            <SelectItem value="maintenance">Manutenção</SelectItem>
            <SelectItem value="labor">Mão de Obra</SelectItem>
            <SelectItem value="other">Outros</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && <p className="text-xs text-rose-500">{errors.category.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplier">Fornecedor</Label>
        <Input id="supplier" placeholder="Nome do fornecedor" {...register('supplier')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="receipt">Comprovante</Label>
        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
          <div className="flex flex-col items-center">
            <Camera className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-xs text-muted-foreground mt-2 font-medium">Tirar foto ou anexar</span>
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
