import React, { useState } from 'react'
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
import { toast } from 'sonner' // Assuming sonner is installed, or adapt to your toast lib

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

type FormData = z.infer<typeof schema>

const mockMachinery = [
  { id: '1', name: 'John Deere 8R', type: 'Trator', hours: '4.200h' },
  { id: '2', name: 'Colheitadeira S780', type: 'Colheitadeira', hours: '1.800h' },
]

export const MachineryPage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [isAddOpen, setIsAddOpen] = useState(false)
  
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  })

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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">Maquinário</h1>
        <Button className="rounded-xl" onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Equipamento
        </Button>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Adicionar Novo Maquinário</DialogTitle>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMachinery.map((m) => (
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
              <p className="text-sm text-muted-foreground">Tipo: {m.type} • Horas: {m.hours}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1"><Wrench className="mr-2 h-4 w-4" /> Manutenção</Button>
                <Button variant="outline" size="sm" className="flex-1"><Fuel className="mr-2 h-4 w-4" /> Combustível</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
