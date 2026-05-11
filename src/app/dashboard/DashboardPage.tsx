import React from 'react'
import { KPICard } from '@/components/dashboard/KPICard'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Sprout,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts'

const data = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Fev', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Abr', revenue: 2780, expenses: 3908 },
  { name: 'Mai', revenue: 1890, expenses: 4800 },
]

const categoryData = [
  { name: 'Sementes', value: 400, color: '#1B4332' },
  { name: 'Combustível', value: 300, color: '#2D6A4F' },
  { name: 'Insumos', value: 300, color: '#D97706' },
  { name: 'Manutenção', value: 200, color: '#B45309' },
]

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Olá, Fazenda Boa Vista</h1>
          <p className="text-muted-foreground">Aqui está o resumo da sua operação hoje.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            Safra 2025/2026
          </Button>
          <Button className="rounded-full shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> Novo Registro
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Saldo Líquido" 
          value="R$ 142.500,00" 
          icon={DollarSign}
          trend={{ value: '12%', positive: true }}
        />
        <KPICard 
          title="Receita Total" 
          value="R$ 280.000,00" 
          icon={TrendingUp}
          description="Vendas de Soja e Milho"
        />
        <KPICard 
          title="Despesa Total" 
          value="R$ 137.500,00" 
          icon={TrendingDown}
          description="Insumos e Diesel"
        />
        <KPICard 
          title="Áreas Ativas" 
          value="1.240 ha" 
          icon={Sprout}
          description="4 Talhões em produção"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-[2.5rem] border border-slate-200/50 p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
          <h3 className="text-lg font-heading font-bold mb-6">Fluxo Financeiro (Mensal)</h3>
          <div className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="revenue" fill="#1B4332" radius={[4, 4, 0, 0]} name="Receita" />
                <Bar dataKey="expenses" fill="#D97706" radius={[4, 4, 0, 0]} name="Despesa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-[2.5rem] border border-slate-200/50 p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
          <h3 className="text-lg font-heading font-bold mb-6">Gastos por Categoria</h3>
          <div className="h-[250px] w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium">R$ {item.value},00</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
