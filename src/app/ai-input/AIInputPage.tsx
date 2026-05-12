import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AIInput {
  id: string;
  created_at: string;
  message: string;
  intent: string;
  status: 'pending' | 'processed' | 'failed';
}

export const AIInputPage: React.FC = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<AIInput[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from('ai_inputs')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setLogs(data);
    };
    fetchLogs();
  }, []);

  const approve = async (id: string) => {
    await supabase.from('ai_inputs').update({ status: 'processed' }).eq('id', id);
    setLogs(logs.map(l => l.id === id ? { ...l, status: 'processed' } : l));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('ai_input.title')}</h1>
      <Card>
        <CardHeader><CardTitle>{t('ai_input.recent_logs')}</CardTitle></CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-muted-foreground">{t('ai_input.no_logs')}</p>
          ) : (
            <div className="space-y-4">
              {logs.map(log => (
                <div key={log.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{log.message}</p>
                    <p className="text-sm text-muted-foreground">{log.intent}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={log.status === 'pending' ? 'outline' : 'default'}>{log.status}</Badge>
                    {log.status === 'pending' && (
                      <Button size="sm" onClick={() => approve(log.id)}>{t('actions.confirm')}</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
