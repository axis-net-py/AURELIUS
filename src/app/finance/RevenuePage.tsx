import React, { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus, Search, FileDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { NewRevenueForm } from './components/NewRevenueForm'
import { useCurrencyStore } from '@/store/useCurrencyStore'
import { formatCurrency } from '@/lib/currency'
import { CurrencySelector } from '@/components/ui/CurrencySelector'

const mockRevenues = [
  { id: '1', date: '2026-05-09', amountBRL: 180000, commodity: 'Soja', buyer: 'Cargill Agrícola', qty: '120 ton' },
  { id: '2', date: '2026-05-06', amountBRL: 65000, commodity: 'Milho', buyer: 'Bunge Alimentos', qty: '80 ton' },
  { id: '3', date: '2026-05-01', amountBRL: 35000, commodity: 'Trigo', buyer: 'Moinho Real', qty: '40 ton' },
]

export const RevenuePage: React.FC = () => {
  const [open, setOpen] = useState(false)
  const { currency } = useCurrencyStore()

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Controle de Receitas</h1>
          <p className="text-muted-foreground">Monitore o faturamento e vendas da sua produção.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <CurrencySelector />
          <Button variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" /> Exportar
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-lg shadow-accent/20 bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="mr-2 h-4 w-4" /> Nova Receita
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nova Receita</DialogTitle>
                <DialogDescription>
                  Preencha os dados abaixo para registrar uma nova receita de venda.
                </DialogDescription>
              </DialogHeader>
              <NewRevenueForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-slate-200/50 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por comprador ou commodity..." className="pl-10 bg-muted/50 border-none" />
        </div>
        <Button variant="secondary">Filtros</Button>
      </div>

      <div className="bg-card rounded-[2rem] border border-slate-200/50 overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-bold">Data</TableHead>
              <TableHead className="font-bold">Commodity</TableHead>
              <TableHead className="font-bold">Quantidade</TableHead>
              <TableHead className="font-bold">Comprador</TableHead>
              <TableHead className="font-bold text-right">Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRevenues.map((revenue) => (
              <TableRow key={revenue.id} className="hover:bg-muted/20 transition-colors">
                <TableCell className="font-medium">{revenue.date}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent uppercase tracking-wide">
                    {revenue.commodity}
                  </span>
                </TableCell>
                <TableCell>{revenue.qty}</TableCell>
                <TableCell className="text-muted-foreground">{revenue.buyer}</TableCell>
                <TableCell className="text-right font-bold text-foreground">{formatCurrency(revenue.amountBRL, currency)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
