import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  Sprout, 
  Truck, 
  Package, 
  Settings,
  LogOut,
  Map,
  Brain,
  BarChart3,
  Wallet,
  ClipboardList,
  Wheat
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { LanguageToggle } from './LanguageToggle'
import { ThemeToggle } from './ThemeToggle'

const navigation = [
  { nameKey: 'dashboard', href: '/', icon: LayoutDashboard },
  { nameKey: 'fields', href: '/fields', icon: Map },
  { nameKey: 'inventory', href: '/inventory', icon: Package },
  { nameKey: 'machinery', href: '/machinery', icon: Truck },
  { nameKey: 'operations', href: '/operations', icon: ClipboardList },
  { nameKey: 'harvest', href: '/harvest', icon: Wheat },
  { nameKey: 'finance', href: '/finance', icon: Wallet },
  { nameKey: 'ai_input', href: '/ai-input', icon: Brain },
  { nameKey: 'reports', href: '/reports', icon: BarChart3 },
  { nameKey: 'settings', href: '/settings', icon: Settings },
]

export const Sidebar: React.FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { signOut } = useAuthStore()

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-border lg:bg-card">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center justify-between flex-shrink-0 px-4 mb-8">
          <span className="text-2xl font-display font-bold text-primary tracking-tight">AgroManager</span>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.nameKey}
                to={item.href}
                className={cn(
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200'
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground',
                    'mr-3 flex-shrink-0 h-5 w-5 transition-colors'
                  )}
                  aria-hidden="true"
                />
                {t(`nav.${item.nameKey}`)}
              </Link>
            )
          })}
        </nav>
      </div>
      
      <div className="flex-shrink-0 flex flex-col border-t border-border p-4 gap-4">
        <div className="flex items-center justify-between">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        
        <button
          onClick={() => signOut()}
          className="group block w-full flex-shrink-0"
        >
          <div className="flex items-center">
            <LogOut className="h-5 w-5 text-muted-foreground group-hover:text-destructive transition-colors" />
            <div className="ml-3">
              <p className="text-sm font-medium text-muted-foreground group-hover:text-destructive transition-colors">{t('actions.logout') || 'Sair'}</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
