import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

export const AIInputPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('ai_input.title')}</h1>
      <Card>
        <CardContent className="pt-6">
          <p>{t('ai_input.subtitle')}</p>
        </CardContent>
      </Card>
    </div>
  );
};
