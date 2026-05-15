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
import { CurrencySelector } from '@/components/ui/CurrencySelector';

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
  const [isDark, setIsDark] = React.useState(
    document.documentElement.classList.contains('dark')
  )

  const toggleLanguage = () => {
    const next = i18n.language === 'es' ? 'pt-BR' : 'es';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  };

  const toggleTheme = () => {
    const newIsDark = !isDark
    document.documentElement.classList.toggle('dark', newIsDark)
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
    setIsDark(newIsDark)
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    if (!user?.farm_id) return;
    const { error } = await supabase.from('farms').upsert({ id: user.farm_id, ...data });
    if (error) toast.error(t('common.error'));
    else toast.success(t('common.saved'));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
      
      <div className="grid grid-cols-1 gap-4">
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
              <div>
                <Label>{t('settings.address')}</Label>
                <Input {...form.register('address')} placeholder="Endereço completo" />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input {...form.register('phone')} placeholder="+595 9X XXXXXXX" />
              </div>
              <Button type="submit">{t('actions.save')}</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('settings.preferences')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>{t('settings.language')}</Label>
              <Button onClick={toggleLanguage}>{i18n.language.toUpperCase()}</Button>
            </div>
            <div className="flex justify-between items-center">
              <Label>{t('settings.dark_mode')}</Label>
              <Switch checked={isDark} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.whatsapp_section')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t('settings.whatsapp_number')}</Label>
              <Input 
                placeholder={t('settings.whatsapp_hint')}
                onChange={(e) => localStorage.setItem('whatsapp_number', e.target.value)}
                defaultValue={localStorage.getItem('whatsapp_number') || ''}
              />
            </div>
            <div className="bg-muted rounded-2xl p-4 text-sm text-muted-foreground">
              <p className="font-medium mb-1">📱 {t('ai_input.how_it_works')}</p>
              <p>{t('ai_input.subtitle')}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.currency_section')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label>{t('settings.currency_section')}</Label>
              <CurrencySelector />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
