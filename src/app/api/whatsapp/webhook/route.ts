import { transcribeAudio, parseMessage } from '@/services/whatsapp/aiService';
import { handleWhatsAppAction } from '@/services/whatsapp/dbService';

export async function POST(req: Request) {
  const body = await req.json();
  
  // Z-API payload structure: type, phone, text.message, audio.audioUrl
  if (body.type === 'ReceivedCallback') {
    const phone = body.phone;
    let text = body.text?.message || '';

    if (body.audio?.audioUrl) {
      text = await transcribeAudio(body.audio.audioUrl);
    }

    const parsed = await parseMessage(text);
    
    // In a production app, resolve farmId based on phone number matching in Supabase
    const farmId = "YOUR_FARM_ID"; 
    
    await handleWhatsAppAction(parsed, phone, farmId);
  }

  return new Response('OK', { status: 200 });
}
