import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Map, Sprout } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { useQuery } from '@tanstack/react-query'

interface Field {
  id: string
  name: string
  area_hectares: number
  status: string
}

interface Season {
  id: string
  name: string
  start_date: string
  status: string
}

export const CropsPage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()

  const { data: fields = [] } = useQuery<Field[]>({
    queryKey: ['fields', user?.farm_id],
    queryFn: async () => {
      if (!user?.farm_id) return []
      const { data } = await supabase.from('fields').select('*').eq('farm_id', user.farm_id)
      return data || []
    },
    enabled: !!user?.farm_id
  })

  const { data: seasons = [] } = useQuery<Season[]>({
    queryKey: ['seasons', user?.farm_id],
    queryFn: async () => {
      if (!user?.farm_id) return []
      const { data } = await supabase.from('crop_seasons').select('*').eq('farm_id', user.farm_id)
      return data || []
    },
    enabled: !!user?.farm_id
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">Talhões e Safras</h1>
      </div>

      <Tabs defaultValue="fields" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fields">Talhões</TabsTrigger>
          <TabsTrigger value="seasons">Safras Ativas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fields" className="space-y-4 pt-4">
            <div className="flex justify-end">
                <Button className="rounded-xl">
                <Plus className="mr-2 h-4 w-4" /> {t('fields.add_button')}
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fields.map((f: Field) => (
                    <Card key={f.id} className="rounded-3xl shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Map className="h-5 w-5 text-primary" />
                                {f.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{t('fields.area')}: {f.area_hectares} ha</p>
                            <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                                {f.status === 'active' ? t('fields.active') : t('fields.inactive')}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>

        <TabsContent value="seasons" className="space-y-4 pt-4">
            <div className="flex justify-end">
                <Button className="rounded-xl">
                <Plus className="mr-2 h-4 w-4" /> {t('seasons.add_button')}
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {seasons.map((s: Season) => (
                    <Card key={s.id} className="rounded-3xl shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Sprout className="h-5 w-5 text-primary" />
                                {s.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{t('seasons.status')}: {t(`seasons.status_options.${s.status}`)}</p>
                            <p className="text-sm">Início: {s.start_date}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs... */}
    </div>
  )
}
