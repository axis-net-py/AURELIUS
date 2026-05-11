import React from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { seasonService } from '@/services/seasonService'
import { useAuthStore } from '@/store/useAuthStore'
import { useTranslation } from 'react-i18next'
import { AddSeasonModal } from './components/AddSeasonModal'
import { type SeasonStatus } from '@/types/farm';

const getStatusColor = (status: SeasonStatus) => {
  switch (status) {
    case 'planned': return "bg-slate-100 text-slate-700 border-slate-200"
    case 'active': return "bg-emerald-100 text-emerald-700 border-emerald-200"
    case 'harvested': return "bg-blue-100 text-blue-700 border-blue-200"
    case 'closed': return "bg-rose-100 text-rose-700 border-rose-200"
    default: return "bg-slate-100 text-slate-700"
  }
}

export const SeasonsPage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()

  const { data: seasons, isLoading, refetch } = useQuery({
    queryKey: ['seasons', user?.farm_id],
    queryFn: () => seasonService.getSeasons(user?.farm_id || ''),
    enabled: !!user?.farm_id
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">{t('seasons.title', 'Controle de Safras')}</h1>
          <p className="text-muted-foreground">{t('seasons.subtitle', 'Gerencie seus ciclos de produção.')}</p>
        </div>
        <AddSeasonModal onSuccess={() => refetch()} />
      </div>

      <div className="bg-card rounded-[2rem] border border-slate-200/50 overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-bold">{t('seasons.name', 'Nome')}</TableHead>
                <TableHead className="font-bold">{t('seasons.commodity', 'Commodity')}</TableHead>
                <TableHead className="font-bold">{t('seasons.start', 'Início')}</TableHead>
                <TableHead className="font-bold">{t('seasons.status', 'Status')}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seasons?.map((season) => (
                <TableRow key={season.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-medium font-heading">{season.name}</TableCell>
                  <TableCell>{season.crop}</TableCell>
                  <TableCell>{season.start_date}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide border",
                      getStatusColor(season.status)
                    )}>
                      {t(`seasons.status.${season.status}`, season.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">{t('actions.view_details', 'Ver detalhes')}</Button>
                  </TableCell>
                </TableRow>
              ))}
              {seasons?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    {t('seasons.no_data', 'Nenhuma safra cadastrada.')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
