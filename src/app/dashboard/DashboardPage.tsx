import React from 'react'
import { KPICard } from '@/components/dashboard/KPICard'
import { 
  DollarSign, 
  Activity,
  Target,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieIcon
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { useCurrencyStore } from '@/store/useCurrencyStore'
import { formatCurrency } from '@/lib/currency'
import { useQuery } from '@tanstack/react-query'
import { financialService } from '@/services/financialService'
import { useAuthStore } from '@/store/useAuthStore'
import { CurrencySelector } from '@/components/ui/CurrencySelector'

// Minimal Gauge Component (Legacy/Telemetry)
const TelemetryGauge = ({ label, value, max, unit }: { label: string, value: number, max: number, unit: string }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-8 border-slate-100 dark:border-slate-800" />
        <div 
          className="absolute top-0 left-0 w-24 h-24 rounded-full border-8 border-primary" 
          style={{ 
            clipPath: `conic-gradient(from 180deg, var(--color-primary) ${percentage/2}%, transparent 0)`,
            transform: 'rotate(180deg)'
          }}
        />
      </div>
      <span className="text-xl font-bold mt-2">{value} <span className="text-xs text-muted-foreground">{unit}</span></span>
      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{label}</span>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const { currency } = useCurrencyStore()
  const { user } = useAuthStore()

  const { data: summary } = useQuery({
    queryKey: ['financial-summary', user?.farm_id],
    queryFn: () => financialService.getSummary(user?.farm_id || ''),
    enabled: !!user?.farm_id
  })

  const totals = summary?.reduce((acc, curr) => ({
    costs: acc.costs + curr.total_costs,
    revenue: acc.revenue + curr.total_revenue,
    profit: acc.profit + curr.profit,
    inputs: acc.inputs + curr.input_costs,
    maintenance: acc.maintenance + curr.maintenance_costs,
    fuel: acc.fuel + curr.fuel_costs
  }), { costs: 0, revenue: 0, profit: 0, inputs: 0, maintenance: 0, fuel: 0 }) || 
  { costs: 0, revenue: 0, profit: 0, inputs: 0, maintenance: 0, fuel: 0 }

  const profitMargin = totals.revenue > 0 ? (totals.profit / totals.revenue) * 100 : 0

  const costDistributionData = [
    { name: t('finance.categories.seeds'), value: totals.inputs, color: '#C19A6B' },
    { name: t('finance.categories.maintenance'), value: totals.maintenance, color: '#f43f5e' },
    { name: t('finance.categories.fuel'), value: totals.fuel, color: '#fbbf24' },
  ].filter(d => d.value > 0)

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-bold text-foreground tracking-tight">
            {t('dashboard.war_room')}
          </h1>
          <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <CurrencySelector />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title={t('dashboard.total_revenue')} 
          value={formatCurrency(totals.revenue, currency)} 
          icon={TrendingUp}
          className="bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/50"
        />
        <KPICard 
          title={t('dashboard.total_costs')} 
          value={formatCurrency(totals.costs, currency)} 
          icon={TrendingDown}
          className="bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/50"
        />
        <KPICard 
          title={t('dashboard.net_profit')} 
          value={formatCurrency(totals.profit, currency)} 
          icon={DollarSign}
          className="bg-primary/5 border-primary/20"
        />
        <KPICard 
          title={t('dashboard.profit_margin')} 
          value={`${profitMargin.toFixed(1)}%`} 
          icon={BarChart3}
          className="bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[2.5rem] border-slate-200/50 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-slate-50/50 dark:bg-slate-900/50 px-8 py-6">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              {t('dashboard.cost_vs_revenue')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                  <XAxis 
                    dataKey="season_name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                    tickFormatter={(value) => `R$ ${value/1000}k`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'var(--color-primary)', opacity: 0.05 }}
                    contentStyle={{ 
                      borderRadius: '1rem', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      backgroundColor: 'var(--color-card)' 
                    }}
                  />
                  <Legend verticalAlign="top" align="right" height={36} />
                  <Bar 
                    dataKey="total_revenue" 
                    name={t('finance.revenues_tab')} 
                    fill="#10b981" 
                    radius={[6, 6, 0, 0]} 
                    barSize={40}
                  />
                  <Bar 
                    dataKey="total_costs" 
                    name={t('finance.expenses_tab')} 
                    fill="#f43f5e" 
                    radius={[6, 6, 0, 0]} 
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
            <Card className="rounded-[2.5rem] border-slate-200/50 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-border/50 bg-slate-50/50 dark:bg-slate-900/50 px-8 py-6">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <PieIcon className="h-5 w-5 text-primary" />
                        {t('dashboard.cost_distribution')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={costDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {costDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                     contentStyle={{ 
                                        borderRadius: '1rem', 
                                        border: 'none', 
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        backgroundColor: 'var(--color-card)' 
                                      }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-slate-200/50 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-border/50 bg-slate-50/50 dark:bg-slate-900/50 px-8 py-6">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    {t('dashboard.efficiency_ratio')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="flex justify-around py-4">
                        <TelemetryGauge label="Fuel Rate" value={42} max={100} unit="L/h" />
                        <TelemetryGauge label="Engine Load" value={78} max={100} unit="%" />
                    </div>
                    
                    <div className="space-y-4 border-t border-border pt-8">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">{t('dashboard.break_even')}</span>
                            <span className="font-bold">68%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }} />
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                            {t('dashboard.roi')}: <span className="text-emerald-600 font-bold">14.2%</span>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
