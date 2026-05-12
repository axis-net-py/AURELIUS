import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sprout, Tractor, Package, Users, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { NewInputForm } from './NewInputForm'
import { NewHarvestForm } from './NewHarvestForm'

// Mock Data Structure for the Season Detail View
const seasonData = {
  name: 'Safra Soja 2025/2026',
  progress: 65,
  stats: { seeds: 'R$ 45.000,00', inputs: 'R$ 22.000,00', machinery: 'R$ 15.000,00', labor: 'R$ 8.000,00' }
}

export const SeasonDetailPage: React.FC = () => {
  const [openInput, setOpenInput] = useState(false)
  const [openHarvest, setOpenHarvest] = useState(false)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-heading font-bold text-foreground">{seasonData.name}</h1>
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
            Ativo
          </span>
        </div>
        <div className="flex gap-2">
          <Dialog open={openInput} onOpenChange={setOpenInput}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-xl"><Plus className="mr-2 h-4 w-4" /> Novo Insumo</Button>
            </DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle>Registrar Insumo</DialogTitle></DialogHeader><NewInputForm onSuccess={() => setOpenInput(false)} /></DialogContent>
          </Dialog>

          <Dialog open={openHarvest} onOpenChange={setOpenHarvest}>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="mr-2 h-4 w-4" /> Nova Colheita</Button>
            </DialogTrigger>
            <DialogContent><DialogHeader><DialogTitle>Registrar Colheita</DialogTitle></DialogHeader><NewHarvestForm onSuccess={() => setOpenHarvest(false)} /></DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto bg-card border border-border rounded-2xl p-1">
          <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Visão Geral</TabsTrigger>
          <TabsTrigger value="seeds" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sementes</TabsTrigger>
          <TabsTrigger value="inputs" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Insumos</TabsTrigger>
          <TabsTrigger value="machinery" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Maquinário</TabsTrigger>
          <TabsTrigger value="harvest" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Colheita</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="rounded-3xl shadow-sm border-slate-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Sementes</CardTitle><Sprout className="h-4 w-4 text-primary" /></CardHeader>
              <CardContent><div className="text-2xl font-bold">{seasonData.stats.seeds}</div></CardContent>
            </Card>
            <Card className="rounded-3xl shadow-sm border-slate-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Insumos</CardTitle><Package className="h-4 w-4 text-primary" /></CardHeader>
              <CardContent><div className="text-2xl font-bold">{seasonData.stats.inputs}</div></CardContent>
            </Card>
            <Card className="rounded-3xl shadow-sm border-slate-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Maquinário</CardTitle><Tractor className="h-4 w-4 text-primary" /></CardHeader>
              <CardContent><div className="text-2xl font-bold">{seasonData.stats.machinery}</div></CardContent>
            </Card>
            <Card className="rounded-3xl shadow-sm border-slate-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Mão de Obra</CardTitle><Users className="h-4 w-4 text-primary" /></CardHeader>
              <CardContent><div className="text-2xl font-bold">{seasonData.stats.labor}</div></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
