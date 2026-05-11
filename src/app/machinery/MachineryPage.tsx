import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tractor, Plus, Wrench, Fuel } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTranslation } from 'react-i18next'

const mockMachinery = [
  { id: '1', name: 'John Deere 8R', type: 'Trator', hours: '4.200h' },
  { id: '2', name: 'Colheitadeira S780', type: 'Colheitadeira', hours: '1.800h' },
]

export const MachineryPage: React.FC = () => {
  const { t } = useTranslation()
  const [isAddOpen, setIsAddOpen] = useState(false)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">Maquinário</h1>
        <Button className="rounded-xl" onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Equipamento
        </Button>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Adicionar Novo Maquinário</DialogTitle>
            </DialogHeader>
            <p>Formulário em implementação...</p>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMachinery.map((m) => (
          <Card key={m.id} className="rounded-3xl border-slate-200/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Tractor className="h-5 w-5 text-primary" />
                </div>
                {m.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Tipo: {m.type} • Horas: {m.hours}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1"><Wrench className="mr-2 h-4 w-4" /> Manutenção</Button>
                <Button variant="outline" size="sm" className="flex-1"><Fuel className="mr-2 h-4 w-4" /> Combustível</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
