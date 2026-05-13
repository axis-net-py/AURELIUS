import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import FormData from 'form-data';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const SYSTEM_PROMPT = `You are an agricultural data assistant for a Brazilian farm management system.
Your job is to extract structured data from natural language messages (in Portuguese) sent by farm operators via WhatsApp.

You must return ONLY a valid JSON object. No explanation. No markdown.

Identify one of these intents and return the corresponding schema:

EXPENSE → { "intent": "expense", "date": "YYYY-MM-DD", "amount": number,
  "category": string, "supplier": string|null, "notes": string|null,
  "season_hint": string|null, "field_hint": string|null }

REVENUE → { "intent": "revenue", "date": "YYYY-MM-DD", "amount": number,
  "commodity": string, "quantity_tons": number|null, "price_per_unit": number|null,
  "buyer": string|null, "season_hint": string|null }

HARVEST → { "intent": "harvest", "date": "YYYY-MM-DD", "area_ha": number|null,
  "gross_qty_tons": number|null, "humidity_pct": number|null,
  "destination": "storage"|"sale"|null, "field_hint": string|null,
  "season_hint": string|null }

FUEL_LOG → { "intent": "fuel_log", "date": "YYYY-MM-DD", "machine_hint": string,
  "liters": number, "cost": number|null }

MAINTENANCE → { "intent": "maintenance", "date": "YYYY-MM-DD",
  "machine_hint": string, "description": string, "cost": number|null }

INPUT_APPLICATION → { "intent": "input_application", "date": "YYYY-MM-DD",
  "product_name": string, "type": string|null, "dose_per_ha": number|null,
  "total_qty": number|null, "total_cost": number|null,
  "season_hint": string|null, "field_hint": string|null }

UNKNOWN → { "intent": "unknown", "raw_text": string }

Rules:
- Use today's date if no date is mentioned.
- Infer category from context (e.g., "herbicida" = pesticide, "diesel" = fuel).
- All monetary values in BRL (Brazilian Real).
- Quantities in metric system (tons, kg, liters, hectares).
- If the message is ambiguous or missing critical fields, return UNKNOWN.`;

export async function analyzeImage(imageUrl: string): Promise<{ diagnosis: string }> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const response = await axios.get(imageUrl, { 
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
    responseType: 'arraybuffer' 
  });
  const base64Image = Buffer.from(response.data).toString('base64');

  const result = await model.generateContent([
    "Você é um agrônomo especialista. Identifique pragas, doenças ou deficiências na imagem e sugira ações imediatas de manejo.",
    {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg',
      },
    },
  ]);

  const text = result.response.text();
  return { diagnosis: text };
}

export async function transcribeAudio(mediaUrl: string): Promise<string> {
  const response = await axios.get(mediaUrl, { 
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` },
    responseType: 'arraybuffer' 
  });
  
  const formData = new FormData();
  formData.append('file', Buffer.from(response.data), 'audio.ogg');
  formData.append('model', 'whisper-1');

  const transcription = await openai.audio.transcriptions.create({
    file: Buffer.from(response.data) as any,
    model: 'whisper-1',
  });
  
  return transcription.text;
}

export async function parseMessage(text: string) {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: text }],
  });

  try {
    const content = message.content[0];
    if (content.type === 'text') {
      return JSON.parse(content.text);
    }
    return { intent: 'unknown', raw_text: text };
  } catch (e) {
    return { intent: 'unknown', raw_text: text };
  }
}
