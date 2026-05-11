import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Sprout, Loader2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-background px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-3xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 mb-4">
            <Sprout className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground">AgroManager</h1>
          <p className="text-muted-foreground">Gestão Rural Inteligente</p>
        </div>

        <Card className="rounded-[2rem] border-slate-200/50 shadow-2xl shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="text-xl">Bem-vindo de volta</CardTitle>
            <CardDescription>Acesse sua conta para gerenciar sua fazenda.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-600 text-sm font-medium border border-rose-100">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com" 
                  {...register('email')}
                />
                {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <a href="#" className="text-xs text-primary hover:underline font-medium">Esqueceu a senha?</a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  {...register('password')}
                />
                {errors.password && <p className="text-xs text-rose-500">{errors.password.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full rounded-xl h-12 text-base font-semibold" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Entrar"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Não tem uma conta? <a href="#" className="text-primary font-semibold hover:underline">Cadastre sua fazenda</a>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
