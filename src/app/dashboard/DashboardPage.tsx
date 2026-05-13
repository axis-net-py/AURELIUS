import React from 'react'
import { KPICard } from '@/components/dashboard/KPICard'
import { 
  DollarSign, 
  Activity,
  Target,
  Plus
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

// Minimal Gauge Component
const TelemetryGauge = ({ label, value, max, unit }: { label: string, value: number, max: number, unit: string }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-8 border-gray-200" />
        <div 
          className="absolute top-0 left-0 w-24 h-24 rounded-full border-8 border-[#C19A6B]" 
          style={{ clipPath: `conic-gradient(from 180deg, #C19A6B ${percentage}%, transparent 0)` }}
        />
      </div>
      <span className="text-xl font-bold mt-2">{value} <span className="text-xs text-muted-foreground">{unit}</span></span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { currency } = useCurrencyStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">War Room</h1>
        <Button onClick={() => navigate('/scouting')}>Ver Scouting</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-3">
          <h3 className="text-lg font-bold mb-6">Live Telemetry</h3>
          <div className="flex justify-around">
            <TelemetryGauge label="Fuel Rate" value={42} max={100} unit="L/h" />
            <TelemetryGauge label="Speed" value={8} max={20} unit="km/h" />
            <TelemetryGauge label="Engine Load" value={78} max={100} unit="%" />
          </div>
        </Card>
      </div>
    </div>
  )
}
