import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts'
import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { HarvestReportPDF } from '@/components/reports/HarvestReportPDF'

const profitabilityData = [
  { name: 'Safra Soja 24/25', cost: 120000, revenue: 280000 },
  { name: 'Safra Milho 25', cost: 90000, revenue: 150000 },
]

const expenseData = [
  { name: 'Sementes', value: 400 },
  { name: 'Fertilizantes', value: 300 },
  { name: 'Defensivos', value: 300 },
  { name: 'Combustível', value: 200 },
]

const COLORS = ['#1B4332', '#2D6A4F', '#D97706', '#B45309']

export const ReportsPage: React.FC = () => {
  const harvestData = [
    { name: 'Soja', quantity: '500 ton', revenue: 'R$ 1.500.000' },
    { name: 'Milho', quantity: '300 ton', revenue: 'R$ 600.000' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Relatórios & Analytics</h1>
          <p className="text-muted-foreground">Análise de rentabilidade e desempenho operacional.</p>
        </div>
        <PDFDownloadLink document={<HarvestReportPDF data={harvestData} />} fileName="relatorio-colheita.pdf">
          {({ loading }) => (
            <Button disabled={loading} className="rounded-xl shadow-lg shadow-primary/20">
              <FileDown className="mr-2 h-4 w-4" /> {loading ? 'Gerando...' : 'Exportar PDF'}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-[2rem] p-6 border-slate-200/50">
          <CardHeader><CardTitle>Lucratividade por Safra (R$)</CardTitle></CardHeader>
          <CardContent className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitabilityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cost" fill="#D97706" name="Custo" />
                <Bar dataKey="revenue" fill="#1B4332" name="Receita" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
          </Card>

          <Card className="rounded-[2rem] p-6 border-slate-200/50">
          <CardHeader><CardTitle>Distribuição de Despesas</CardTitle></CardHeader>
          <CardContent className="h-[300px] w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {expenseData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          </Card>

      </div>
    </div>
  )
}
