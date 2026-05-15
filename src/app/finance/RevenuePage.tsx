import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus, Search, FileDown, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { NewRevenueForm } from './components/NewRevenueForm'
import { useCurrencyStore } from '@/store/useCurrencyStore'
import { formatCurrency } from '@/lib/currency'
import { CurrencySelector } from '@/components/ui/CurrencySelector'
import { supabase } from '@/lib/supabase'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'

interface Revenue {
  id: string
  date: string
  commodity: string
  buyer: string | null
  amount: number
  quantity_tons: number | null
}

export const RevenuePage: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { currency } = useCurrencyStore()
  const { t } = useTranslation()

  const { data: revenues = [], isLoading, refetch } = useQuery<Revenue[]>({
    queryKey: ['revenues'],
    queryFn: async () => {
      if (!supabase) return []
      const { data, error } = await supabase
        .from('revenues')
        .select('*, fields(name)')
        .order('date', { ascending: false })
      if (error) throw error
      return (data as unknown as Revenue[]) || []
    }
  })

  const filtered = revenues.filter((r) =>
    r.buyer?.toLowerCase().includes(search.toLowerCase()) ||
    r.commodity?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            {t('finance.revenues_tab')}
          </h1>
          <p className="text-muted-foreground">{t('finance.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <CurrencySelector />
          <Button variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" /> {t('actions.export')}
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-lg shadow-accent/20 bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="mr-2 h-4 w-4" /> {t('finance.add_revenue')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('finance.add_revenue')}</DialogTitle>
                <DialogDescription>{t('finance.subtitle')}</DialogDescription>
              </DialogHeader>
              <NewRevenueForm onSuccess={() => { setOpen(false); refetch() }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-slate-200/50 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('finance.buyer') + ' / ' + t('finance.commodity')}
            className="pl-10 bg-muted/50 border-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card rounded-[2rem] border border-slate-200/50 overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
            <p className="text-lg font-medium">{t('finance.no_revenues')}</p>
            <p className="text-sm mt-1">{t('finance.add_revenue')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-bold">{t('finance.date')}</TableHead>
                  <TableHead className="font-bold">{t('finance.commodity')}</TableHead>
                  <TableHead className="font-bold">{t('finance.quantity')}</TableHead>
                  <TableHead className="font-bold">{t('finance.buyer')}</TableHead>
                  <TableHead className="font-bold text-right">{t('finance.amount')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((revenue: Revenue) => (
                  <TableRow key={revenue.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium">{revenue.date}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent uppercase tracking-wide">
                        {revenue.commodity}
                      </span>
                    </TableCell>
                    <TableCell>
                      {revenue.quantity_tons ? `${revenue.quantity_tons} ton` : '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {revenue.buyer || '—'}
                    </TableCell>
                    <TableCell className="text-right font-bold text-foreground">
                      {formatCurrency(revenue.amount, currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
