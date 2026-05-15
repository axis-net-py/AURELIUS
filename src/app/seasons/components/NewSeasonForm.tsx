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
import { seasonService } from '@/services/seasonService'
import { useAuthStore } from '@/store/useAuthStore'

const seasonSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  crop: z.string().min(1, "A cultura é obrigatória"),
  start_date: z.string().min(1, "A data de início é obrigatória"),
  status: z.enum(['planned', 'active', 'harvested', 'closed']),
})

type SeasonFormValues = z.infer<typeof seasonSchema>

interface NewSeasonFormProps {
  onSuccess: (data: unknown) => void
}

export const NewSeasonForm: React.FC<NewSeasonFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { t } = useTranslation()
  const { user } = useAuthStore()

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<SeasonFormValues>({
    resolver: zodResolver(seasonSchema),
    defaultValues: {
      name: '',
      crop: '',
      start_date: new Date().toISOString().split('T')[0],
      status: 'active',
    }
  })

  const onSubmit = async (data: SeasonFormValues) => {
    if (!user?.farm_id) {
      console.error("No farm_id found for user")
      return
    }

    setIsLoading(true)
    try {
      const seasonData = {
        farm_id: user.farm_id,
        name: data.name,
        crop: data.crop,
        start_date: data.start_date,
        status: data.status,
      }
      
      const result = await seasonService.createSeason(seasonData)
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
      <div className="space-y-2">
        <Label htmlFor="name">{t('seasons.form.name', 'Nome da Safra')}</Label>
        <Input id="name" placeholder="Ex: Safra Soja 2025/2026" {...register('name')} />
        {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="crop">{t('seasons.form.crop', 'Cultura')}</Label>
          <Select onValueChange={(v) => setValue('crop', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Soja">Soja</SelectItem>
              <SelectItem value="Milho">Milho</SelectItem>
              <SelectItem value="Trigo">Trigo</SelectItem>
              <SelectItem value="Algodão">Algodão</SelectItem>
              <SelectItem value="Outros">Outros</SelectItem>
            </SelectContent>
          </Select>
          {errors.crop && <p className="text-xs text-rose-500">{errors.crop.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="start_date">{t('seasons.form.start_date', 'Data de Início')}</Label>
          <Input id="start_date" type="date" {...register('start_date')} />
          {errors.start_date && <p className="text-xs text-rose-500">{errors.start_date.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">{t('seasons.form.status', 'Status')}</Label>
        <Select defaultValue="active" onValueChange={(v) => setValue('status', v as 'planned' | 'active' | 'harvested' | 'closed')}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planned">{t('seasons.status.planned', 'Planejada')}</SelectItem>
            <SelectItem value="active">{t('seasons.status.active', 'Ativa')}</SelectItem>
            <SelectItem value="harvested">{t('seasons.status.harvested', 'Colhida')}</SelectItem>
            <SelectItem value="closed">{t('seasons.status.closed', 'Encerrada')}</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && <p className="text-xs text-rose-500">{errors.status.message}</p>}
      </div>

      <div className="pt-4 flex gap-2">
        <Button type="submit" className="flex-1 rounded-xl h-12" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('actions.saving', 'Salvando...')}
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              {t('actions.save', 'Salvar')}
            </>
          )}
        </Button>
        <Button variant="outline" type="button" onClick={() => reset()} className="flex-1 rounded-xl h-12">
          {t('actions.clear', 'Limpar')}
        </Button>
      </div>
    </form>
  )
}
