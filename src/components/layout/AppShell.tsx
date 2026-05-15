import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { ThemeToggle } from './ThemeToggle'
import { LanguageToggle } from './LanguageToggle'
import { AIInputModal } from '../ai/AIInputModal'
import { VoiceInputFAB } from '../ui/VoiceInputFAB'

export const AppShell: React.FC = () => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)

  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <span className="text-xl font-display font-bold text-primary tracking-tight">AgroManager</span>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
      <Sidebar />
      
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-20 lg:pb-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 pt-4 lg:pt-8">
            <Outlet />
          </div>
        </main>
      </div>

      <VoiceInputFAB />
      <BottomNav />
      <AIInputModal open={isAIModalOpen} onOpenChange={setIsAIModalOpen} />
    </div>
  )
}
