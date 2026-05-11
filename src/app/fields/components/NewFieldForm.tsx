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
import { Loader2, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { fieldService } from '@/services/fieldService'
import { useAuthStore } from '@/store/useAuthStore'

const fieldSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  area: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Área deve ser um número positivo",
  }),
  crop: z.string().min(1, "A cultura é obrigatória"),
  status: z.enum(['active', 'inactive']),
})

type FieldFormValues = z.infer<typeof fieldSchema>

interface NewFieldFormProps {
  onSuccess: (data: any) => void
}

export const NewFieldForm: React.FC<NewFieldFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { t } = useTranslation()
  const { user } = useAuthStore()

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FieldFormValues>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      name: '',
      area: '',
      crop: '',
      status: 'active',
    }
  })

  const onSubmit = async (data: FieldFormValues) => {
    if (!user?.farm_id) {
      console.error("No farm_id found for user")
      return
    }

    setIsLoading(true)
    try {
      const fieldData = {
        farm_id: user.farm_id,
        name: data.name,
        area: parseFloat(data.area),
        crop: data.crop,
        status: data.status,
      }
      
      const result = await fieldService.createField(fieldData)
      onSuccess(result)
      reset()
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
          <Label htmlFor="name">Nome do Talhão</Label>
          <Input id="name" placeholder="Ex: Talhão Norte" {...register('name')} />
          {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="area">Área (hectares)</Label>
          <Input id="area" type="number" step="0.01" placeholder="0,00" {...register('area')} />
          {errors.area && <p className="text-xs text-rose-500">{errors.area.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="crop">Cultura</Label>
        <Select onValueChange={(v) => setValue('crop', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a cultura" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Soja">Soja</SelectItem>
            <SelectItem value="Milho">Milho</SelectItem>
            <SelectItem value="Trigo">Trigo</SelectItem>
            <SelectItem value="Algodão">Algodão</SelectItem>
            <SelectItem value="Café">Café</SelectItem>
            <SelectItem value="Outros">Outros</SelectItem>
          </SelectContent>
        </Select>
        {errors.crop && <p className="text-xs text-rose-500">{errors.crop.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select defaultValue="active" onValueChange={(v) => setValue('status', v as 'active' | 'inactive')}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && <p className="text-xs text-rose-500">{errors.status.message}</p>}
      </div>

      <div className="pt-4 flex gap-2">
        <Button type="submit" className="flex-1 rounded-xl h-12" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Salvar
            </>
          )}
        </Button>
        <Button variant="outline" type="button" onClick={() => reset()} className="flex-1 rounded-xl h-12">
          Limpar
        </Button>
      </div>
    </form>
  )
}
