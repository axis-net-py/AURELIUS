import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const ThemeToggle: React.FC = () => {
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark')
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="p-1 cursor-pointer">
      <Moon className="h-5 w-5 hidden dark:block text-muted-foreground hover:text-foreground" />
      <Sun className="h-5 w-5 dark:hidden text-muted-foreground hover:text-foreground" />
    </Button>
  )
}
