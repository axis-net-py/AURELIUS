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
import { NewExpenseForm } from './components/NewExpenseForm'
import { useCurrencyStore } from '@/store/useCurrencyStore'
import { formatCurrency } from '@/lib/currency'
import { CurrencySelector } from '@/components/ui/CurrencySelector'

const mockExpenses = [
  { id: '1', date: '2026-05-08', amountBRL: 12400, category: 'Sementes', supplier: 'AgroSeeds Ltda', field: 'Talhão Norte' },
  { id: '2', date: '2026-05-07', amountBRL: 3200, category: 'Combustível', supplier: 'Posto Petro', field: 'Logística' },
  { id: '3', date: '2026-05-05', amountBRL: 45000, category: 'Insumos', supplier: 'Fertiliza S.A.', field: 'Talhão Sul' },
  { id: '4', date: '2026-05-02', amountBRL: 1500, category: 'Manutenção', supplier: 'Mecânica John', field: 'Frota' },
]

export const ExpensePage: React.FC = () => {
  const [open, setOpen] = useState(false)
  const { currency } = useCurrencyStore()

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Controle de Despesas</h1>
          <p className="text-muted-foreground">Gerencie todos os custos da sua produção.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <CurrencySelector />
          <Button variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" /> Exportar
          </Button>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-lg shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" /> Nova Despesa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nova Despesa</DialogTitle>
                <DialogDescription>
                  Preencha os dados abaixo para registrar uma nova despesa.
                </DialogDescription>
              </DialogHeader>
              <NewExpenseForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-slate-200/50 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por fornecedor, categoria ou talhão..." className="pl-10 bg-muted/50 border-none" />
        </div>
        <Button variant="secondary">Filtros</Button>
      </div>

      <div className="bg-card rounded-[2rem] border border-slate-200/50 overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-bold">Data</TableHead>
              <TableHead className="font-bold">Categoria</TableHead>
              <TableHead className="font-bold">Fornecedor</TableHead>
              <TableHead className="font-bold">Talhão</TableHead>
              <TableHead className="font-bold text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockExpenses.map((expense) => (
              <TableRow key={expense.id} className="hover:bg-muted/20 transition-colors">
                <TableCell className="font-medium">{expense.date}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary uppercase tracking-wide">
                    {expense.category}
                  </span>
                </TableCell>
                <TableCell>{expense.supplier}</TableCell>
                <TableCell className="text-muted-foreground">{expense.field}</TableCell>
                <TableCell className="text-right font-bold text-foreground">{formatCurrency(expense.amountBRL, currency)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
