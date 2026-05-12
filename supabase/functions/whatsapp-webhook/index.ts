import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.0";

const genAI = new GoogleGenerativeAI(Deno.env.get("AI_API_KEY")!);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  const token = req.headers.get("x-whatsapp-token");
  if (token !== Deno.env.get("WHATSAPP_TOKEN")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await req.json();
  const text = payload.type === 'audio' ? await transcribeAudio(payload.audio_url) : payload.text;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Você é o assistente técnico do Aurelius. Extraia dados estruturados (JSON) de mensagens sobre gastos, colheita e abastecimento do agronegócio (PT/ES).
  Retorne um JSON com a ação (insert ou upsert), a tabela alvo (fuel_logs, harvest_logs, etc.) e os dados. Se for uma correção, use upsert.
  Mensagem: ${text}`;

  const result = await model.generateContent(prompt);
  const jsonResponse = JSON.parse(result.response.text());

  // Logic to insert/update into Supabase using admin client would go here
  
  return new Response(JSON.stringify({ status: "processed", data: jsonResponse }), {
    headers: { "Content-Type": "application/json" },
  });
});

async function transcribeAudio(url: string) {
  // Mock transcription logic
  return "Abasteci 150L no Trator 02 agora";
}
