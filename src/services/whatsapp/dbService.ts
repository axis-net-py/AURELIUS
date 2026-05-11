import { supabase } from '@/lib/supabase';
import axios from 'axios';

const ZAPI_INSTANCE_ID = "3F2ED81A37CED1820941423ED5B98F9F";
const ZAPI_TOKEN = "DAA35D3930BC743D7AA28836";
const ZAPI_URL = `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_TOKEN}/send-text`;

export async function handleWhatsAppAction(parsedData: any, phone: string, farmId: string) {
  if (parsedData.intent === 'unknown') {
    return await sendWhatsAppMessage(phone, "⚠️ Não entendi. Por favor, tente descrever com mais detalhes o valor e o produto.");
  }

  // Resolve Foreign Keys (simple mock resolution)
  const { data: season } = await supabase
    .from('crop_seasons')
    .select('id')
    .eq('farm_id', farmId)
    .ilike('name', `%${parsedData.season_hint || ''}%`)
    .single();

  // Insert Record
  const tableMap: Record<string, string> = {
    expense: 'expenses',
    revenue: 'revenues',
    harvest: 'harvests',
    fuel_log: 'machinery_logs',
    input_application: 'inputs'
  };

  const { error } = await supabase
    .from(tableMap[parsedData.intent])
    .insert([{ ...parsedData, farm_id: farmId, season_id: season?.id }]);

  if (error) {
    return await sendWhatsAppMessage(phone, "❌ Erro ao salvar dados no sistema.");
  }

  return await sendWhatsAppMessage(phone, `✅ ${parsedData.intent.toUpperCase()} registrado com sucesso.`);
}

export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    await axios.post(ZAPI_URL, {
      phone: to,
      message: message
    }, {
      headers: { 
        'Client-Token': process.env.ZAPI_CLIENT_TOKEN 
      }
    });
  } catch (error) {
    console.error("Failed to send WhatsApp message", error);
  }
}
