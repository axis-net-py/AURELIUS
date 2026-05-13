import { transcribeAudio, parseMessage, analyzeImage } from '@/services/whatsapp/aiService';
import { handleWhatsAppAction } from '@/services/whatsapp/dbService';

export async function POST(req: Request) {
  const body = await req.json();

  if (body.type === 'ReceivedCallback') {
    const phone = body.phone;
    let text = body.text?.message || '';

    // Process audio
    if (body.audio?.audioUrl) {
      text = await transcribeAudio(body.audio.audioUrl);
    } 
    // Process image
    else if (body.image?.imageUrl) {
      const diagnosis = await analyzeImage(body.image.imageUrl);
      text = `Diagnóstico de Campo: ${diagnosis.diagnosis}`;
      // In production, save to field_diagnoses table
    }

    const parsed = await parseMessage(text);

    const farmId = "YOUR_FARM_ID"; 

    await handleWhatsAppAction(parsed, phone, farmId);
  }

  return new Response('OK', { status: 200 });
}

