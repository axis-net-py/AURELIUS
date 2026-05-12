import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { useAuthStore } from '@/store/useAuthStore'
import { DashboardPage } from '@/app/dashboard/DashboardPage'
import { LoginPage } from '@/app/auth/LoginPage'
import { ExpensePage } from '@/app/finance/ExpensePage'
import { RevenuePage } from '@/app/finance/RevenuePage'
import { SeasonsPage } from '@/app/seasons/SeasonsPage'
import { MachineryPage } from '@/app/machinery/MachineryPage'
import { InventoryPage } from '@/app/inventory/InventoryPage'
import { ReportsPage } from '@/app/reports/ReportsPage'
import { FieldsPage } from '@/app/fields/FieldsPage'
import { FinancePage } from '@/app/finance/FinancePage'
import { SettingsPage } from '@/app/settings/SettingsPage'
import { AIInputPage } from '@/app/ai-input/AIInputPage'

function App() {
  const { user, isLoading } = useAuthStore()

  // MOCK USER for Phase 1 Demo/Development
  const devUser = { id: '1', email: 'allan@agro.com', role: 'owner' as const, farm_id: null }
  const effectiveUser = user || devUser

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary rounded-full mb-4"></div>
          <p className="text-muted-foreground font-medium">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={!effectiveUser ? <LoginPage /> : <Navigate to="/" />} />
      
      <Route element={effectiveUser ? <AppShell /> : <Navigate to="/login" />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/expenses" element={<ExpensePage />} />
        <Route path="/revenues" element={<RevenuePage />} />
        <Route path="/seasons" element={<SeasonsPage />} />
        <Route path="/fields" element={<FieldsPage />} />
        <Route path="/machinery" element={<MachineryPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/ai-input" element={<AIInputPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  )
}

export default App
