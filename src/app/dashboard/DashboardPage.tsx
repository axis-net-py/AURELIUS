import React, { useState } from 'react'
import { KPICard } from '@/components/dashboard/KPICard'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Sprout,
  Plus,
  Receipt,
  Activity,
  Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useCurrencyStore } from '@/store/useCurrencyStore'
import { formatCurrency } from '@/lib/currency'

const data = [
  { name: 'Jan', revenue: 4000, costs: 2400 },
  { name: 'Fev', revenue: 3000, costs: 1398 },
  { name: 'Mar', revenue: 2000, costs: 980 },
  { name: 'Abr', revenue: 2780, costs: 390 },
  { name: 'Mai', revenue: 1890, costs: 480 },
  { name: 'Jun', revenue: 3500, costs: 1200 },
]

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { currency } = useCurrencyStore()

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">War Room</h1>
          <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="2025/2026">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('reports.filter_season')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025/2026">Safra 2025/2026</SelectItem>
              <SelectItem value="2024/2025">Safra 2024/2025</SelectItem>
            </SelectContent>
          </Select>
          <Button className="rounded-full" onClick={() => navigate('/revenues')}>
            <Plus className="mr-2 h-4 w-4" /> {t('dashboard.new_record')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title={t('dashboard.net_profit')} value={formatCurrency(142500, currency)} icon={DollarSign} />
        <KPICard title={t('dashboard.efficiency_ratio')} value="12.4" icon={Activity} description="Sacas / Litro" />
        <KPICard title={t('dashboard.cost_per_ha')} value={formatCurrency(450, currency)} icon={Target} />
        <Card className="flex flex-col items-center justify-center p-6 bg-card border-2 border-primary/20">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Farm Health Score</h3>
          <div className="text-4xl font-bold text-[#1B4332] dark:text-[#C19A6B]">88</div>
        </Card>
      </div>

      <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm">
        <h3 className="text-lg font-heading font-bold mb-6">Receita vs Custos</h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B4332" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1B4332" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C19A6B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#C19A6B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => formatCurrency(val, currency)} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#1B4332" fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="costs" stroke="#C19A6B" fillOpacity={1} fill="url(#colorCosts)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
