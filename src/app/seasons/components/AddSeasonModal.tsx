import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { NewSeasonForm } from "./NewSeasonForm"
import { useTranslation } from 'react-i18next'

interface AddSeasonModalProps {
  onSuccess: () => void
}

export const AddSeasonModal: React.FC<AddSeasonModalProps> = ({ onSuccess }) => {
  const [open, setOpen] = React.useState(false)
  const { t } = useTranslation()

  const handleSuccess = () => {
    setOpen(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> {t('seasons.add_button', 'Nova Safra')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold">{t('seasons.add_title', 'Adicionar Nova Safra')}</DialogTitle>
        </DialogHeader>
        <NewSeasonForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
