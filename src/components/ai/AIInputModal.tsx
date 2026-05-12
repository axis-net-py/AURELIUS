import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useTranslation } from 'react-i18next'
import { type ParsedAgroData, aiService } from '@/services/aiService'
import { useAuthStore } from '@/store/useAuthStore'
import { Loader2, Send, CheckCircle2, AlertCircle } from 'lucide-react'

interface AIInputModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const AIInputModal: React.FC<AIInputModalProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedAgroData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleParse = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    try {
      const result = await aiService.parseAgroIntent(input)
      setParsedData(result)
    } catch (err) {
      console.error(err)
      setError(t('ai.parse_error') || 'Erro ao processar mensagem')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async () => {
    if (!parsedData || !user) return
    setLoading(true)
    try {
      await aiService.resolveAndSave(parsedData, user.id)
      onOpenChange(false)
      setInput('')
      setParsedData(null)
    } catch (err) {
      console.error(err)
      setError(t('ai.save_error') || 'Erro ao salvar dados')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-heading">
            <Send className="h-6 w-6 text-primary" />
            {t('nav.ai_input')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!parsedData ? (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {t('ai.input_hint') || 'Digite sua mensagem como se estivesse no WhatsApp (ex: "Gastei 500 em diesel")'}
              </p>
              <Textarea
                placeholder={t('ai.placeholder') || 'O que aconteceu hoje?'}
                className="min-h-[120px] rounded-2xl border-slate-200 focus-visible:ring-primary"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-xl">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {parsedData.intent}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Confiança: {(parsedData.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <pre className="text-sm font-mono overflow-auto max-h-[150px] p-2 bg-background rounded-lg border border-border">
                  {JSON.stringify(parsedData.data, null, 2)}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Os dados acima parecem corretos?
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          {!parsedData ? (
            <Button 
              className="w-full rounded-full h-12 text-lg font-medium"
              disabled={loading || !input.trim()}
              onClick={handleParse}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              {t('ai.btn_parse') || 'Analisar Mensagem'}
            </Button>
          ) : (
            <div className="flex gap-3 w-full">
              <Button 
                variant="outline" 
                className="flex-1 rounded-full h-12"
                onClick={() => setParsedData(null)}
                disabled={loading}
              >
                {t('actions.cancel') || 'Voltar'}
              </Button>
              <Button 
                className="flex-1 rounded-full h-12 bg-primary text-primary-foreground"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
                {t('actions.confirm') || 'Confirmar'}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
