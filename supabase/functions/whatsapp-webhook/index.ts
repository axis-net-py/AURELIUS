import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  const token = req.headers.get("x-whatsapp-token");
  if (token !== Deno.env.get("WHATSAPP_TOKEN")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await req.json();
  console.log("Payload:", payload);

  // Here would be the logic for LLM processing or audio transcription
  // We'll return a 200 OK for now to acknowledge receipt
  return new Response(JSON.stringify({ status: "received" }), {
    headers: { "Content-Type": "application/json" },
  });
});
