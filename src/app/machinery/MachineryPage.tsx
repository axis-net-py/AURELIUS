import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tractor, Plus, Wrench, Fuel } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const schema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  type: z.enum(['Trator','Colheitadeira','Plantadeira',
                'Pulverizador','Caminhão','Outro']),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().min(1950).max(2030).optional(),
  identifier: z.string().optional(),
  current_hours: z.number().min(0).optional(),
})

const maintenanceSchema = z.object({
  date: z.string(),
  type: z.enum(['preventive','corrective']),
  description: z.string().min(1),
  cost: z.string().optional(),
})

const fuelSchema = z.object({
  date: z.string(),
  liters: z.string().min(1),
  cost: z.string().min(1),
})

interface Machine {
  id: string
  name: string
  type: string
  current_hours: number
}

interface MaintenanceFormData {
  date: string
  type: 'preventive' | 'corrective'
  description: string
  cost: string
}

interface FuelFormData {
  date: string
  liters: string
  cost: string
}

export const MachineryPage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [machinery, setMachinery] = useState<Machine[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [maintenanceTarget, setMaintenanceTarget] = useState<Machine | null>(null)
  const [fuelTarget, setFuelTarget] = useState<Machine | null>(null)
  
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const fetchMachinery = async () => {
      const { data, error } = await supabase
        .from('machinery')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) setMachinery(data as Machine[])
      setLoadingData(false)
    }
    fetchMachinery()
  }, [])

  const onSubmit = async (data: FormData) => {
    if (!user?.farm_id) return
    const { error } = await supabase
      .from('machinery')
      .insert({ ...data, farm_id: user.farm_id })

    if (error) {
      toast.error('Erro ao salvar equipamento')
      return
    }
    toast.success('Equipamento adicionado com sucesso')
    setIsAddOpen(false)
    form.reset()
  }

  if (loadingData) return <div className="flex justify-center p-8">
    <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent" />
  </div>

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">{t('machinery.title')}</h1>
        <Button className="rounded-xl" onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> {t('machinery.add_button')}
        </Button>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{t('machinery.add_title')}</DialogTitle>
                <DialogDescription className="sr-only">Formulário para adicionar equipamento</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <input {...form.register('name')} placeholder="Nome" className="w-full border p-2 rounded" />
                <select {...form.register('type')} className="w-full border p-2 rounded">
                    <option value="Trator">{t('machinery.types.tractor')}</option>
                    <option value="Colheitadeira">{t('machinery.types.harvester')}</option>
                    <option value="Plantadeira">{t('machinery.types.planter')}</option>
                    <option value="Pulverizador">{t('machinery.types.sprayer')}</option>
                    <option value="Caminhão">{t('machinery.types.truck')}</option>
                    <option value="Outro">{t('machinery.types.other')}</option>
                </select>
                <Button type="submit">{t('actions.save', 'Salvar')}</Button>
            </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!maintenanceTarget} onOpenChange={() => setMaintenanceTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('machinery.maintenance')} — {maintenanceTarget?.name}</DialogTitle>
            <DialogDescription className="sr-only">Registro de manutenção</DialogDescription>
          </DialogHeader>
          <MaintenanceForm
            machineId={maintenanceTarget?.id}
            onSuccess={() => setMaintenanceTarget(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!fuelTarget} onOpenChange={() => setFuelTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('machinery.fuel')} — {fuelTarget?.name}</DialogTitle>
            <DialogDescription className="sr-only">Registro de combustível</DialogDescription>
          </DialogHeader>
          <FuelForm
            machineId={fuelTarget?.id}
            onSuccess={() => setFuelTarget(null)}
          />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {machinery.map((m) => (
          <Card key={m.id} className="rounded-3xl border-slate-200/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Tractor className="h-5 w-5 text-primary" />
                </div>
                {m.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{t('machinery.type')}: {m.type} • {t('machinery.current_hours')}: {m.current_hours}h</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setMaintenanceTarget(m)}>
                  <Wrench className="mr-2 h-4 w-4" /> {t('machinery.maintenance')}
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setFuelTarget(m)}>
                  <Fuel className="mr-2 h-4 w-4" /> {t('machinery.fuel')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const MaintenanceForm = ({ machineId, onSuccess }: { machineId: string, onSuccess: () => void }) => {
  const [loading, setLoading] = React.useState(false)
  const form = useForm<MaintenanceFormData>({ resolver: zodResolver(maintenanceSchema),
    defaultValues: { date: new Date().toISOString().split('T')[0], type: 'preventive' }
  })
  const onSubmit = async (data: MaintenanceFormData) => {
    setLoading(true)
    const { error } = await supabase.from('machinery_maintenance').insert({
      machinery_id: machineId,
      date: data.date,
      type: data.type,
      description: data.description,
      cost: data.cost ? parseFloat(data.cost) : null,
    })
    if (error) { toast.error('Erro ao salvar'); setLoading(false); return }
    toast.success('Manutenção registrada')
    onSuccess()
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Data</Label>
          <Input type="date" {...form.register('date')} />
        </div>
        <div>
          <Label>Tipo</Label>
          <select {...form.register('type')} className="w-full border border-input bg-background p-2 rounded-lg text-sm">
            <option value="preventive">Preventiva</option>
            <option value="corrective">Corretiva</option>
          </select>
        </div>
      </div>
      <div>
        <Label>Descrição</Label>
        <Input {...form.register('description')} placeholder="Descreva o serviço" />
      </div>
      <div>
        <Label>Custo (R$)</Label>
        <Input type="number" step="0.01" {...form.register('cost')} placeholder="0,00" />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar Manutenção'}
      </Button>
    </form>
  )
}

const FuelForm = ({ machineId, onSuccess }: { machineId: string, onSuccess: () => void }) => {
  const [loading, setLoading] = React.useState(false)
  const form = useForm<FuelFormData>({ resolver: zodResolver(fuelSchema),
    defaultValues: { date: new Date().toISOString().split('T')[0] }
  })
  const onSubmit = async (data: FuelFormData) => {
    setLoading(true)
    const { error } = await supabase.from('machinery_logs').insert({
      machinery_id: machineId,
      date: data.date,
      fuel_liters: parseFloat(data.liters),
      fuel_cost: parseFloat(data.cost),
      operation_type: 'fuel',
    })
    if (error) { toast.error('Erro ao salvar'); setLoading(false); return }
    toast.success('Abastecimento registrado')
    onSuccess()
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Data</Label>
          <Input type="date" {...form.register('date')} />
        </div>
        <div>
          <Label>Litros</Label>
          <Input type="number" step="0.1" {...form.register('liters')} placeholder="0.0" />
        </div>
      </div>
      <div>
        <Label>Custo Total</Label>
        <Input type="number" step="0.01" {...form.register('cost')} placeholder="0,00" />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Salvando...' : 'Registrar Abastecimento'}
      </Button>
    </form>
  )
}
