import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

const farmSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  cnpj: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const form = useForm({ resolver: zodResolver(farmSchema) });

  const toggleLanguage = () => {
    const next = i18n.language === 'es' ? 'pt-BR' : 'es';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', !isDark);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  const onSubmit = async (data: any) => {
    if (!user?.farm_id) return;
    const { error } = await supabase.from('farms').upsert({ id: user.farm_id, ...data });
    if (error) toast.error(t('common.error'));
    else toast.success(t('common.saved'));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>{t('settings.farm_profile')}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>{t('settings.farm_name')}</Label>
                <Input {...form.register('name')} />
              </div>
              <div>
                <Label>{t('settings.cnpj')}</Label>
                <Input {...form.register('cnpj')} />
              </div>
              <Button type="submit">{t('actions.save')}</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Preferências</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>{t('settings.language')}</Label>
              <Button onClick={toggleLanguage}>{i18n.language.toUpperCase()}</Button>
            </div>
            <div className="flex justify-between items-center">
              <Label>Modo Escuro</Label>
              <Switch onClick={toggleTheme} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
