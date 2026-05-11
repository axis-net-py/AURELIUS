import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  MessageSquare, 
  CircleDollarSign,
  Menu
} from 'lucide-react'

export const BottomNav: React.FC = () => {
  const location = useLocation()
  const { t } = useTranslation()

  const mobileNavigation = [
    { name: t('nav.dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('nav.fields'), href: '/fields', icon: MapIcon },
    { name: t('nav.ai_input'), href: '/ai-input', icon: MessageSquare },
    { name: t('nav.finance'), href: '/expenses', icon: CircleDollarSign },
    { name: t('nav.settings'), href: '/reports', icon: Menu },
  ]

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card/80 backdrop-blur-md pb-safe-area-inset-bottom z-50">
      <nav className="flex justify-around items-center h-16">
        {mobileNavigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] mt-1 font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
