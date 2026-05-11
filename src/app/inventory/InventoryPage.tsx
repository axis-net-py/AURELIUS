import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, Plus, AlertCircle } from 'lucide-react'

const mockInventory = [
  { id: '1', name: 'Glifosato 480', category: 'Defensivos', stock: 45, unit: 'L', threshold: 20 },
  { id: '2', name: 'Semente Soja M7739', category: 'Sementes', stock: 12, unit: 'Bags', threshold: 15 },
]

export const InventoryPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">Estoque</h1>
        <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" /> Novo Item</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockInventory.map((item) => (
          <Card key={item.id} className="rounded-3xl border-slate-200/50 shadow-sm relative">
            {item.stock < item.threshold && (
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
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
              </div>
              <div className="flex items-end justify-between border-t border-border pt-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Em estoque</p>
                  <p className="text-2xl font-bold">{item.stock} <span className="text-sm font-normal">{item.unit}</span></p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Alerta</p>
                  <p className="text-sm font-semibold">{item.threshold} {item.unit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
