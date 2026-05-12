import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
      <Card>
        <CardHeader><CardTitle>{t('settings.farm_profile')}</CardTitle></CardHeader>
        <CardContent>
          <p>Formulário de perfil em breve...</p>
        </CardContent>
      </Card>
    </div>
  );
};
