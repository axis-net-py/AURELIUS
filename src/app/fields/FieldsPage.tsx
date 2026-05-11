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
import { MapPin, BarChart2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { fieldService } from '@/services/fieldService'
import { useAuthStore } from '@/store/useAuthStore'
import { useTranslation } from 'react-i18next'
import { AddFieldModal } from './components/AddFieldModal'

export const FieldsPage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  
  const { data: fields, isLoading, refetch } = useQuery({
    queryKey: ['fields', user?.farm_id],
    queryFn: () => fieldService.getFields(user?.farm_id || ''),
    enabled: !!user?.farm_id
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">{t('fields.title', 'Controle de Talhões')}</h1>
          <p className="text-muted-foreground">{t('fields.subtitle', 'Gerencie suas áreas de plantio.')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
          >
            <MapPin className="mr-2 h-4 w-4" /> {t('fields.view_map', 'Visualizar Mapa')}
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <BarChart2 className="mr-2 h-4 w-4" /> Analytics
          </Button>
          <AddFieldModal onSuccess={() => refetch()} />
        </div>
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
                <TableHead className="font-bold">{t('fields.name', 'Nome')}</TableHead>
                <TableHead className="font-bold">{t('fields.area', 'Área (ha)')}</TableHead>
                <TableHead className="font-bold">{t('fields.crop', 'Cultura')}</TableHead>
                <TableHead className="font-bold">{t('fields.status', 'Status')}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields?.map((field) => (
                <TableRow key={field.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-medium font-heading">{field.name}</TableCell>
                  <TableCell>{field.area.toFixed(1)}</TableCell>
                  <TableCell>{field.crop}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide",
                      field.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                    )}>
                      {field.status === 'active' ? t('fields.active', 'Ativo') : t('fields.inactive', 'Inativo')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="ghost" size="sm">{t('actions.edit', 'Editar')}</Button>
                      <Button variant="secondary" size="sm" className="p-2">
                        <MapPin className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {fields?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    {t('fields.no_data', 'Nenhum talhão cadastrado.')}
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