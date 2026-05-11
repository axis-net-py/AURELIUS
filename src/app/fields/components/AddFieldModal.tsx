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
import { NewFieldForm } from "./NewFieldForm"

interface AddFieldModalProps {
  onSuccess: () => void
}

export const AddFieldModal: React.FC<AddFieldModalProps> = ({ onSuccess }) => {
  const [open, setOpen] = React.useState(false)

  const handleSuccess = () => {
    setOpen(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Novo Talhão
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold">Adicionar Novo Talhão</DialogTitle>
        </DialogHeader>
        <NewFieldForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
