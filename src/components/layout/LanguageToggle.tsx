import React from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation()
  const currentLang = i18n.language

  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('lang', lang)
  }

  const isPT = currentLang.startsWith('pt')
  const isES = currentLang.startsWith('es')

  return (
    <div className="flex bg-muted p-1 rounded-pill w-fit border border-border">
      <button
        onClick={() => setLanguage('pt-BR')}
        className={cn(
          "px-3 py-1 rounded-pill text-[10px] font-bold transition-all cursor-pointer",
          isPT 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        PT
      </button>
      <button
        onClick={() => setLanguage('es')}
        className={cn(
          "px-3 py-1 rounded-pill text-[10px] font-bold transition-all cursor-pointer",
          isES 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        ES
      </button>
    </div>
  )
}
