import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { useQuery } from '@tanstack/react-query'

interface HarvestRecord {
  id: string
  date: string
  quantity: number
  storage_location: string | null
  fields: { name: string, area_hectares: number } | null
  crop_seasons: { name: string } | null
}

export const HarvestPage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()

  const { data: harvestRecords = [] } = useQuery<HarvestRecord[]>({
    queryKey: ['harvest', user?.farm_id],
    queryFn: async () => {
      if (!user?.farm_id) return []
      const { data } = await supabase.from('harvest_records').select('*, fields(name, area_hectares), crop_seasons(name)').eq('farm_id', user.farm_id)
      return (data as unknown as HarvestRecord[]) || []
    },
    enabled: !!user?.farm_id
  })

  const totalHarvested = harvestRecords.reduce((acc, curr) => acc + curr.quantity, 0)
  const avgYield = harvestRecords.length ? (totalHarvested / harvestRecords.reduce((acc, curr) => acc + (curr.fields?.area_hectares || 1), 0)) : 0

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
                <Button className="rounded-xl">
                    <Plus className="mr-2 h-4 w-4" /> Registrar Colheita
                </Button>
            </div>
            {harvestRecords.map((h: HarvestRecord) => (
                <Card key={h.id} className="p-4 flex items-center justify-between">
                    <div>
                        <p className="font-bold">{h.fields?.name} - {h.crop_seasons?.name}</p>
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
