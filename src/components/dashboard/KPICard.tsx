import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string
  description?: string
  icon: React.ElementType
  trend?: {
    value: string
    positive: boolean
  }
  className?: string
}

export const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  trend,
  className 
}) => {
  return (
    <Card className={cn("overflow-hidden rounded-[2.5rem] border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-heading font-bold text-foreground mb-1">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mb-2">
            {description}
          </p>
        )}
        {trend && (
          <div className={cn(
            "text-xs font-medium inline-flex items-center rounded-full px-2 py-1",
            trend.positive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
          )}>
            {trend.positive ? "+" : "-"}{trend.value} em relação ao mês anterior
          </div>
        )}
      </CardContent>
    </Card>
  )
}
