import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, Plus, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

const inventorySchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  category: z.enum(['seeds', 'fertilizers', 'pesticides', 'fuel', 'parts', 'other']),
  unit: z.enum(['kg', 'L', 'bag', 'unidade', 'ton']),
  quantity: z.number().min(0),
  min_threshold: z.number().min(0),
  unit_cost: z.number().optional(),
})

type InventoryFormData = z.infer<typeof inventorySchema>

export const InventoryPage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)

  const { data: inventory, refetch } = useQuery({
    queryKey: ['inventory', user?.farm_id],
    queryFn: async () => {
        const { data } = await supabase.from('inventory_items').select('*').eq('farm_id', user?.farm_id)
        return data || []
    },
    enabled: !!user?.farm_id
  })

  const form = useForm<InventoryFormData>({ resolver: zodResolver(inventorySchema) })

  const onSubmit = async (data: InventoryFormData) => {
    if (!user?.farm_id) return
    const { error } = await supabase.from('inventory_items').insert({ ...data, farm_id: user.farm_id })
    if (error) { toast.error(t('common.error')); return }
    toast.success(t('common.saved'))
    setIsAddItemOpen(false)
    form.reset()
    refetch()
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">{t('inventory.title')}</h1>
        <Button className="rounded-xl" onClick={() => setIsAddItemOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> {t('inventory.add_button')}
        </Button>
      </div>

      <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t('inventory.add_title')}</DialogTitle>
                <DialogDescription className="sr-only">Formulário de estoque</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <input {...form.register('name')} placeholder={t('inventory.name')} className="w-full border p-2 rounded" />
                <select {...form.register('category')} className="w-full border p-2 rounded">
                    {Object.keys(t('inventory.categories', { returnObjects: true }) as any).map((cat: string) => (
                        <option key={cat} value={cat}>{t(`inventory.categories.${cat}`)}</option>
                    ))}
                </select>
                <input type="number" {...form.register('quantity', { valueAsNumber: true })} placeholder={t('inventory.quantity')} className="w-full border p-2 rounded" />
                <Button type="submit">{t('actions.save')}</Button>
            </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory?.map((item: any) => (
          <Card key={item.id} className="rounded-3xl border-slate-200/50 shadow-sm relative">
            {item.quantity < item.min_threshold && (
              <div className="absolute top-4 right-4 text-rose-500 animate-pulse">
                <AlertCircle className="h-5 w-5" />
              </div>
            )}
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{t(`inventory.categories.${item.category}`)}</p>
                </div>
              </div>
              <div className="flex items-end justify-between border-t border-border pt-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{t('inventory.quantity')}</p>
                  <p className="text-2xl font-bold">{item.quantity} <span className="text-sm font-normal">{item.unit}</span></p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{t('inventory.min_quantity')}</p>
                  <p className="text-sm font-semibold">{item.min_threshold} {item.unit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
