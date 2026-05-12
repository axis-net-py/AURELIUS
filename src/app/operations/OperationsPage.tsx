import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ClipboardList, Loader2, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTranslation } from 'react-i18next'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'

const operationSchema = z.object({
  field_id: z.string().min(1),
  crop_season_id: z.string().min(1),
  machinery_id: z.string().min(1),
  operation_type: z.enum(['Planting', 'Spraying', 'Fertilizing', 'Harvesting']),
  date: z.string().min(1),
  notes: z.string().optional(),
  inputs: z.array(z.object({
    inventory_item_id: z.string().min(1),
    quantity_used: z.number().min(0.01)
  })).min(1)
})

type FormData = z.infer<typeof operationSchema>

export const OperationsPage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [isAddOpen, setIsAddOpen] = useState(false)

  const { data: operations } = useQuery({
    queryKey: ['operations', user?.farm_id],
    queryFn: async () => {
      const { data } = await supabase.from('field_operations').select('*, fields(name), crop_seasons(name), machinery(name)')
      return data || []
    }
  })

  const { data: fields } = useQuery({ queryKey: ['fields'], queryFn: async () => (await supabase.from('fields').select('*')).data || [] })
  const { data: seasons } = useQuery({ queryKey: ['seasons'], queryFn: async () => (await supabase.from('crop_seasons').select('*')).data || [] })
  const { data: machinery } = useQuery({ queryKey: ['machinery'], queryFn: async () => (await supabase.from('machinery').select('*')).data || [] })
  const { data: inventory } = useQuery({ queryKey: ['inventory'], queryFn: async () => (await supabase.from('inventory_items').select('*')).data || [] })

  const form = useForm<FormData>({ resolver: zodResolver(operationSchema), defaultValues: { inputs: [{ inventory_item_id: '', quantity_used: 0 }] } })
  const { fields: inputFields, append, remove } = useFieldArray({ control: form.control, name: 'inputs' })

  const onSubmit = async (data: FormData) => {
    // 1. Insert Operation
    const { data: op, error: opError } = await supabase.from('field_operations')
      .insert({ ...data, farm_id: user?.farm_id }).select().single()
    if (opError) { toast.error('Erro ao salvar operação'); return }

    // 2. Insert Inputs (Trigger handles deduction)
    const inputs = data.inputs.map(input => {
      const item = inventory?.find(i => i.id === input.inventory_item_id)
      return { 
        operation_id: op.id, 
        inventory_item_id: input.inventory_item_id, 
        quantity_used: input.quantity_used,
        cost_at_time: item?.average_cost || 0
      }
    })
    
    await supabase.from('operation_inputs').insert(inputs)
    toast.success('Operação registrada')
    setIsAddOpen(false)
    form.reset()
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">{t('operations.title')}</h1>
        <Button className="rounded-xl" onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> {t('operations.new_entry')}
        </Button>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{t('operations.new_entry')}</DialogTitle></DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select onValueChange={(v) => form.setValue('field_id', v)}><SelectTrigger><SelectValue placeholder="Talhão" /></SelectTrigger><SelectContent>{fields?.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent></Select>
              <Select onValueChange={(v) => form.setValue('crop_season_id', v)}><SelectTrigger><SelectValue placeholder="Safra" /></SelectTrigger><SelectContent>{seasons?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select>
              <Select onValueChange={(v) => form.setValue('machinery_id', v)}><SelectTrigger><SelectValue placeholder="Maquinário" /></SelectTrigger><SelectContent>{machinery?.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent></Select>
              <Select onValueChange={(v: any) => form.setValue('operation_type', v)}><SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger><SelectContent>{['Planting', 'Spraying', 'Fertilizing', 'Harvesting'].map(o => <SelectItem key={o} value={o}>{t(`operations.types.${o.toLowerCase()}`)}</SelectItem>)}</SelectContent></Select>
            </div>
            
            <div className="space-y-2">
              <Label>{t('operations.inputs')}</Label>
              {inputFields.map((field, idx) => (
                <div key={field.id} className="flex gap-2">
                  <Select onValueChange={(v) => form.setValue(`inputs.${idx}.inventory_item_id` as any, v)}><SelectTrigger><SelectValue placeholder="Insumo" /></SelectTrigger><SelectContent>{inventory?.map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}</SelectContent></Select>
                  <Input type="number" {...form.register(`inputs.${idx}.quantity_used` as any, { valueAsNumber: true })} placeholder="Qtd" />
                  <Button variant="ghost" size="icon" onClick={() => remove(idx)}><Trash2 className="h-4 w-4 text-rose-500" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append({ inventory_item_id: '', quantity_used: 0 })}>+</Button>
            </div>

            <Button type="submit" className="w-full">Salvar Operação</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {operations?.map((op: any) => (
          <Card key={op.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-bold">{t(`operations.types.${op.operation_type.toLowerCase()}`)}</p>
              <p className="text-sm text-muted-foreground">{op.fields.name} • {op.crop_seasons.name}</p>
            </div>
            <div className="text-right text-sm">
              <p>{op.date}</p>
              <p className="text-xs">{op.machinery.name}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
