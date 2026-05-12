import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpensePage } from '../finance/ExpensePage';
import { RevenuePage } from '../finance/RevenuePage';
import { useTranslation } from 'react-i18next';

export const FinancePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('finance.title')}</h1>
      <Tabs defaultValue="expenses">
        <TabsList>
          <TabsTrigger value="expenses">{t('finance.expenses_tab')}</TabsTrigger>
          <TabsTrigger value="revenues">{t('finance.revenues_tab')}</TabsTrigger>
        </TabsList>
        <TabsContent value="expenses"><ExpensePage /></TabsContent>
        <TabsContent value="revenues"><RevenuePage /></TabsContent>
      </Tabs>
    </div>
  );
};
