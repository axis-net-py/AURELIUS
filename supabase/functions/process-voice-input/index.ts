import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const genAI = new GoogleGenerativeAI(Deno.env.get("AI_API_KEY")!);
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" } });
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");
    const farmId = formData.get("farm_id"); // Produtor deve enviar o ID da fazenda no form

    if (!audioFile || !farmId) {
      return new Response(JSON.stringify({ error: "Missing audio or farm_id" }), { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      Você é um assistente de gestão agrícola. Transcreva o áudio e extraia a intenção.
      Intenções: ADICIONAR_DESPESA, ADICIONAR_RECEITA, DIAGNOSTICO_SCOUTING.
      Se for ADICIONAR_DESPESA, extraia: amount, category, supplier, date (YYYY-MM-DD).
      Se for ADICIONAR_RECEITA, extraia: amount, commodity, buyer, date (YYYY-MM-DD).
      Retorne APENAS um JSON: {"intent": "...", "data": {...}, "message": "..."}.
    `;

    // Processamento simplificado (Assumindo que o conteúdo do áudio foi tratado antes ou via File API)
    const result = await model.generateContent([prompt]);
    const json = JSON.parse(result.response.text());

    // Persistência automática baseada na intenção
    if (json.intent === "ADICIONAR_DESPESA") {
      await supabase.from('expenses').insert({ ...json.data, farm_id: farmId });
    } else if (json.intent === "ADICIONAR_RECEITA") {
      await supabase.from('revenues').insert({ ...json.data, farm_id: farmId });
    }

    return new Response(JSON.stringify(json), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
