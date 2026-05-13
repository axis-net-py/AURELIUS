import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const ScoutingPage: React.FC = () => {
  const { data: scoutingLogs, isLoading } = useQuery({
    queryKey: ['field_diagnoses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('field_diagnoses')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Histórico de Scouting</h1>
      {isLoading ? (
        <p>Carregando logs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scoutingLogs?.map((log) => (
            <Card key={log.id}>
              <CardHeader>
                <CardTitle>Diagnóstico - {new Date(log.created_at).toLocaleDateString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={log.image_url} alt="Scouting" className="w-full h-48 object-cover mb-4 rounded" />
                <p className="text-sm">{log.ai_diagnosis}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
