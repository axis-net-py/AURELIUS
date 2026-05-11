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
import { Loader2 } from 'lucide-react'

const inputSchema = z.object({
  product_name: z.string().min(1, "O nome do produto é obrigatório"),
  type: z.string().min(1, "O tipo é obrigatório"),
  application_date: z.string(),
  dose_per_ha: z.string().min(1, "Dose é obrigatória"),
  total_qty: z.string().min(1, "Quantidade total é obrigatória"),
  total_cost: z.string().min(1, "Custo total é obrigatório"),
  applicator: z.string().optional(),
})

type InputFormValues = z.infer<typeof inputSchema>

export const NewInputForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = React.useState(false)

  const { register, handleSubmit, setValue } = useForm<InputFormValues>({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      application_date: new Date().toISOString().split('T')[0],
    }
  })

  const onSubmit = async () => {
    setIsLoading(true)
    // Simulate Supabase insert
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="product_name">Produto</Label>
        <Input id="product_name" {...register('product_name')} placeholder="Ex: Glifosato" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select onValueChange={(v) => setValue('type', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="herbicide">Herbicida</SelectItem>
              <SelectItem value="fungicide">Fungicida</SelectItem>
              <SelectItem value="insecticide">Inseticida</SelectItem>
              <SelectItem value="fertilizer">Fertilizante</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="application_date">Data</Label>
          <Input id="application_date" type="date" {...register('application_date')} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dose_per_ha">Dose/ha</Label>
          <Input id="dose_per_ha" type="number" step="0.1" {...register('dose_per_ha')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="total_qty">Total</Label>
          <Input id="total_qty" type="number" step="0.1" {...register('total_qty')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="total_cost">Custo R$</Label>
          <Input id="total_cost" type="number" step="0.01" {...register('total_cost')} />
        </div>
      </div>

      <Button type="submit" className="w-full rounded-xl h-12" disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin" /> : "Registrar Aplicação"}
      </Button>
    </form>
  )
}
