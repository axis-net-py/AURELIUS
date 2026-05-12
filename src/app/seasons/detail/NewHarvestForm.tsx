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

const harvestSchema = z.object({
  date: z.string(),
  area_ha: z.string().min(1, "Área é obrigatória"),
  gross_qty_tons: z.string().min(1, "Quantidade é obrigatória"),
  humidity_pct: z.string().min(1, "Umidade é obrigatória"),
  destination: z.string().min(1, "Destino é obrigatório"),
})

type HarvestFormValues = z.infer<typeof harvestSchema>

export const NewHarvestForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = React.useState(false)

  const { register, handleSubmit, setValue } = useForm<HarvestFormValues>({
    resolver: zodResolver(harvestSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    }
  })

  const onSubmit = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="date">Data da Colheita</Label>
        <Input id="date" type="date" {...register('date')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="area_ha">Área Colhida (ha)</Label>
          <Input id="area_ha" type="number" {...register('area_ha')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gross_qty_tons">Produção (Ton)</Label>
          <Input id="gross_qty_tons" type="number" {...register('gross_qty_tons')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="humidity_pct">Umidade (%)</Label>
          <Input id="humidity_pct" type="number" {...register('humidity_pct')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination">Destino</Label>
          <Select onValueChange={(v) => setValue('destination', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="storage">Armazém</SelectItem>
              <SelectItem value="sale">Venda Direta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full rounded-xl h-12" disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin" /> : "Registrar Colheita"}
      </Button>
    </form>
  )
}
