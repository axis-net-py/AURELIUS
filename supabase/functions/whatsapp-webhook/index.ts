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
  
  if (payload.type === 'image') {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imagePart = {
      inlineData: {
        data: payload.image_base64,
        mimeType: "image/jpeg",
      },
    };
    const result = await model.generateContent([
      "Você é um agrônomo sênior. Analise esta imagem do campo e forneça um diagnóstico técnico curto, identificando possíveis pragas ou anomalias.",
      imagePart
    ]);
    
    // Save to field_scouting table (would use supabase client)
    return new Response(JSON.stringify({ status: "processed", diagnosis: result.response.text() }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ status: "received" }));
});
