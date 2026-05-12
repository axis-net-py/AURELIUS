import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Wheat, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

const harvestSchema = z.object({
  field_id: z.string().min(1),
  crop_season_id: z.string().min(1),
  quantity: z.number().min(0.01),
  moisture: z.number().optional(),
  storage_location: z.string().optional(),
  date: z.string().min(1),
})

export const HarvestPage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [isAddHarvestOpen, setIsAddHarvestOpen] = useState(false)

  const { data: harvestRecords } = useQuery({
    queryKey: ['harvest', user?.farm_id],
    queryFn: async () => {
      const { data } = await supabase.from('harvest_records').select('*, fields(name, area_hectares), crop_seasons(name)')
      return data || []
    }
  })

  // Mock KPIs based on harvestRecords data
  const totalHarvested = harvestRecords?.reduce((acc, curr) => acc + curr.quantity, 0) || 0
  const avgYield = harvestRecords?.length ? (totalHarvested / harvestRecords.reduce((acc, curr) => acc + (curr.fields?.area_hectares || 1), 0)) : 0

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">{t('harvest.title')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardHeader><CardTitle className="text-sm">{t('harvest.yield')}</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{totalHarvested.toLocaleString()} kg</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Média de Produtividade</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{avgYield.toFixed(2)} kg/ha</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">{t('harvest.gross_revenue')}</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">R$ 0,00</p></CardContent></Card>
      </div>

      <Tabs defaultValue="harvest" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="harvest">{t('harvest.tabs.records')}</TabsTrigger>
          <TabsTrigger value="sales">{t('harvest.tabs.sales')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="harvest" className="space-y-4 pt-4">
            <div className="flex justify-end">
                <Button className="rounded-xl" onClick={() => setIsAddHarvestOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Registrar Colheita
                </Button>
            </div>
            {harvestRecords?.map((h: any) => (
                <Card key={h.id} className="p-4 flex items-center justify-between">
                    <div>
                        <p className="font-bold">{h.fields.name} - {h.crop_seasons.name}</p>
                        <p className="text-sm text-muted-foreground">{h.date}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-emerald-600">{h.quantity} kg</p>
                        <p className="text-xs text-muted-foreground">{h.storage_location}</p>
                    </div>
                </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
