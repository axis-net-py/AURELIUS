import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Decimal } from "decimal.js";
import { createPurchaseInvoice, createSalesInvoice } from "@/app/actions/invoice";
import {
  resolveLocale,
  localeLanguageName,
  serverMessages,
} from "@/lib/i18n/server-messages";

// Normalizes numbers (integer for PYG, float for quantity) and cleans LatAm separators
function parseExtractedNumber(val: any, isPyg: boolean = false): number {
  if (val === undefined || val === null) return 0;
  
  if (typeof val === "string") {
    let s = val.replace(/\s/g, "");
    if (isPyg) {
      if (s.includes(".") && s.includes(",")) {
        s = s.replace(/\./g, "").replace(/,/g, ".");
      } else if (s.includes(".")) {
        s = s.replace(/\./g, "");
      } else if (s.includes(",")) {
        s = s.replace(/,/g, ".");
      }
      return parseFloat(s) || 0;
    } else {
      if (s.includes(".") && s.includes(",")) {
        s = s.replace(/\./g, "").replace(/,/g, ".");
      } else if (s.includes(",")) {
        s = s.replace(/,/g, ".");
      }
      return parseFloat(s) || 0;
    }
  }
  
  if (typeof val === "number") {
    if (isPyg && val > 0 && val < 1000) {
      if (val % 1 !== 0) {
        const strVal = val.toString();
        const decimalPart = strVal.split(".")[1] || "";
        const decimalCount = decimalPart.length;
        const factor = Math.max(1000, Math.pow(10, decimalCount));
        return Math.round(val * factor);
      } else {
        return val * 1000;
      }
    }
    return val;
  }
  
  return 0;
}

// Normalizes and maps product units (e.g. diesel/combustivel -> L, UNI -> un)
function normalizeUnit(name: string, extractedUnit?: string): string {
  const n = (name || "").toLowerCase();
  if (
    n.includes("diesel") ||
    n.includes("gasolina") ||
    n.includes("combustivel") ||
    n.includes("combustível") ||
    n.includes("etanol") ||
    n.includes("ethanol") ||
    n.includes("lubrificante") ||
    n.includes("oleo") ||
    n.includes("óleo")
  ) {
    return "L";
  }
  
  const u = (extractedUnit || "").toLowerCase().trim();
  if (u === "uni" || u === "unidade" || u === "unidades" || u === "un") return "un";
  if (u === "kg" || u === "kilo" || u === "quilo" || u === "kilogramas") return "kg";
  if (u === "l" || u === "litro" || u === "litros") return "L";
  if (u === "sc" || u === "saca" || u === "sacas" || u === "bag") return "sc";
  if (u === "ton" || u === "tonelada" || u === "toneladas") return "ton";
  
  return extractedUnit || "un";
}

// Helper to query Gemini API via fetch (avoids adding npm dependencies that could fail to build)
async function callGemini(prompt: string, imageBase64?: string, mimeType?: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    let contents: any[] = [];
    if (imageBase64 && mimeType) {
      contents = [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: imageBase64
              }
            }
          ]
        }
      ];
    } else {
      contents = [
        {
          parts: [{ text: prompt }]
        }
      ];
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
      console.error("Gemini API error:", await response.text());
      return null;
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.error("Failed calling Gemini API:", err);
    return null;
  }
}

// Local NLP Fallback Engine
function localNlpProcessor(text: string) {
  const cleanText = text.toLowerCase().trim();

  // 1. SAFRA
  if (cleanText.includes("safra") || cleanText.includes("cosecha")) {
    let name = "Nova Safra";
    let crop = "soja";
    
    const cropMatch = cleanText.match(/(soja|milho|trigo|algodão|algodao|arroz|cosecha)/i);
    if (cropMatch) crop = cropMatch[1].replace("cosecha", "soja").replace("algodão", "algodao");
    
    const nameMatch = text.match(/(?:safra|cosecha)\s+de\s+([a-zA-Z0-9\s-]+)|(?:safra|cosecha)\s+([a-zA-Z0-9\s-]+)/i);
    if (nameMatch) name = nameMatch[1] || nameMatch[2];

    return {
      action: "create_harvest",
      data: {
        name: name.trim(),
        cropType: crop,
        startDate: new Date(),
        endDate: new Date(Date.now() + 120 * 86400000), // 120 days cycle default
      },
      message: `Safra "${name.trim()}" de ${crop} identificada e cadastrada com sucesso!`
    };
  }

  // 2. TALHÃO
  if (cleanText.includes("talhão") || cleanText.includes("talhao") || cleanText.includes("parcela")) {
    let name = "Novo Talhão";
    let area = 10;
    let unit = "HECTARE";

    const areaMatch = cleanText.match(/(\d+(?:[.,]\d+)?)\s*(ha|hectare|hectares|alq|alqueire|alqueires)/i);
    if (areaMatch) {
      area = parseFloat(areaMatch[1].replace(",", "."));
      const unitStr = areaMatch[2].toLowerCase();
      if (unitStr.startsWith("alq")) unit = "ALQUEIRE";
    }

    const nameMatch = text.match(/(?:talhão|talhao|parcela)\s+([a-zA-Z0-9\s\.\-áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ]+)/i);
    if (nameMatch) {
      name = nameMatch[1].replace(/\d+(?:[.,]\d+)?\s*(ha|hectare|hectares|alq|alqueire|alqueires).*/gi, "").replace(/\s+de\s+$/i, "").trim();
    }

    return {
      action: "create_plot",
      data: {
        name: name || "Talhão IA",
        area: area,
        unit: unit,
        status: "PLANTED",
      },
      message: `Talhão "${name || "Talhão IA"}" de ${area} ${unit === "HECTARE" ? "hectares" : "alqueires"} identificado e cadastrado com sucesso!`
    };
  }

  // 3. FUNCIONÁRIO (Check before vehicle to prevent 'tratorista' matching 'trator' vehicle check)
  if (cleanText.includes("funcionário") || cleanText.includes("funcionario") || cleanText.includes("operador") || cleanText.includes("tratorista") || cleanText.includes("agrônomo") || cleanText.includes("agronomo")) {
    let name = "Novo Funcionário";
    let role = "operador";

    if (cleanText.includes("tratorista")) role = "tratorista";
    else if (cleanText.includes("agrônomo") || cleanText.includes("agronomo")) role = "agronomo";
    else if (cleanText.includes("gerente") || cleanText.includes("supervisor")) role = "gerente";
    else if (cleanText.includes("auxiliar")) role = "auxiliar";

    const nameMatch = text.match(/(?:funcionário|funcionario|operador|tratorista|agrônomo|agronomo|auxiliar|gerente)\s+([a-zA-Z\sáàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ]+)/i);
    if (nameMatch) {
      name = nameMatch[1].replace(/\s*(tratorista|operador|agronomo|agrônomo|auxiliar|gerente)/gi, "").trim();
    }

    return {
      action: "create_employee",
      data: {
        name: name || "Funcionário IA",
        role: role,
        status: "ACTIVE",
      },
      message: `Funcionário "${name || "Funcionário IA"}" com cargo de ${role} cadastrado com sucesso!`
    };
  }

  // 4. FROTA
  if (cleanText.includes("frota") || cleanText.includes("veículo") || cleanText.includes("maquinário") || cleanText.includes("trator") || cleanText.includes("colheitadeira") || cleanText.includes("máquina")) {
    let name = "Novo Veículo";
    let type = "trator";

    if (cleanText.includes("colheitadeira")) type = "colheitadeira";
    else if (cleanText.includes("pulverizador")) type = "pulverizador";
    else if (cleanText.includes("caminhão") || cleanText.includes("caminhao")) type = "caminhao";
    else if (cleanText.includes("implemento")) type = "implemento";

    const nameMatch = text.match(/(?:frota|veículo|veiculo|máquina|maquina|trator|colheitadeira|caminhão|caminhao|pulverizador)\s+([a-zA-Z0-9\s-]+)/i);
    if (nameMatch) name = nameMatch[1].trim();

    return {
      action: "create_vehicle",
      data: {
        name: name || `Veículo ${type}`,
        type: type,
        status: "OPERATIONAL",
      },
      message: `Máquina/Veículo "${name || `Veículo ${type}`}" do tipo ${type} cadastrado com sucesso!`
    };
  }

  // 5. CONTRATO
  if (cleanText.includes("contrato")) {
    let contractNumber = `CT-${Math.floor(100 + Math.random() * 900)}`;
    let siloName = "Silo Geral";
    let grainType = "soja";
    let quantity = 100;
    let unit = "TON";
    let pricePerUnit = 20;
    let currency = "USD";

    const numMatch = cleanText.match(/(?:número|nro|nº|numero|contrato)\s*([a-zA-Z0-9-]+)/i);
    if (numMatch) contractNumber = numMatch[1].toUpperCase();

    const siloMatch = cleanText.match(/(?:silo|silos|comprador)\s+([a-zA-Z0-9áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ]+)/i);
    if (siloMatch) {
      const potentialSilo = siloMatch[1].trim();
      if (!["soja", "milho", "trigo", "arroz", "algodao", "tonelada", "toneladas", "sacas", "quilos"].includes(potentialSilo.toLowerCase())) {
        siloName = "Silo " + potentialSilo.charAt(0).toUpperCase() + potentialSilo.slice(1);
      }
    }

    const grainMatch = cleanText.match(/(soja|milho|trigo|algodão|algodao|arroz)/i);
    if (grainMatch) grainType = grainMatch[1].toLowerCase().replace("algodão", "algodao");

    const qtyMatch = cleanText.match(/(\d+(?:[.,]\d+)?)\s*(toneladas|tonelada|ton|sacas|saca|sc|quilos|quilo|kg)/i);
    if (qtyMatch) {
      quantity = parseFloat(qtyMatch[1].replace(",", "."));
      const unitStr = qtyMatch[2].toLowerCase();
      if (unitStr.startsWith("ton")) unit = "TON";
      else if (unitStr.startsWith("saca") || unitStr.startsWith("sc")) unit = "BAG";
      else if (unitStr.startsWith("kg") || unitStr.startsWith("quilo")) unit = "KG";
    }

    const priceMatch = cleanText.match(/(?:por|a|preço|precio)\s*(\d+(?:[.,]\d+)?)\s*(dolares|dólares|usd|\$|reais|brl|r\$|guaranis|pyg|g\$)/i);
    if (priceMatch) {
      pricePerUnit = parseFloat(priceMatch[1].replace(",", "."));
      const curStr = priceMatch[2].toLowerCase();
      if (curStr.includes("dolar") || curStr.includes("usd") || curStr.includes("$")) currency = "USD";
      else if (curStr.includes("real") || curStr.includes("brl") || curStr.includes("r$")) currency = "BRL";
      else if (curStr.includes("guarani") || curStr.includes("pyg") || curStr.includes("g$")) currency = "PYG";
    }

    return {
      action: "create_contract",
      data: {
        contractNumber,
        siloName,
        grainType,
        quantity,
        unit,
        pricePerUnit,
        currency,
        status: "ACTIVE",
      },
      message: `Contrato de venda "${contractNumber}" para o ${siloName} (${quantity} ${unit.toLowerCase()} de ${grainType}) cadastrado com sucesso!`
    };
  }

  // default response
  return {
    action: "chat",
    message: `Olá! Eu entendi: "${text}". Posso ajudar você a gerenciar safras, talhões, frota, funcionários ou contratos de grãos. Diga comandos como "cadastrar contrato 202 de soja para silo Alfa de 500 toneladas".`
  };
}

// Local Leaf Disease Diagnostic Fallback
function localDiseaseDiagnostic() {
  const diagnoses = [
    {
      disease: "Ferrugem Asiática (Phakopsora pachyrhizi)",
      severity: "Moderada (25% de infecção foliar)",
      recommendation: "Recomenda-se aplicação imediata de fungicidas sistêmicos (triazóis + estrobilurinas ou carboxamidas). Monitore talhões vizinhos diariamente.",
    },
    {
      disease: "Oídio (Microsphaera diffusa)",
      severity: "Baixa (10% de cobertura de micélio esbranquiçado)",
      recommendation: "Condições secas favorecem o desenvolvimento. Recomenda-se aplicação de enxofre ou fungicidas específicos caso a infecção avance para o terço médio da planta.",
    },
    {
      disease: "Mancha Alvo (Corynespora cassiicola)",
      severity: "Alta (45% de desfolha no baixeiro)",
      recommendation: "Infecção severa observada. Utilize fungicidas de sítio específico e faça rotação de modos de ação (carboxamidas associadas a multissítios). Limite o trânsito no talhão para evitar disseminação de esporos.",
    }
  ];

  // Pick a random disease for demo purposes
  const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];

  return {
    action: "diagnostic",
    message: `**Diagnóstico de Doença de Planta:**\n\n- **Doença Identificada:** ${diagnosis.disease}\n- **Gravidade:** ${diagnosis.severity}\n\n**Recomendações Agronômicas:**\n${diagnosis.recommendation}\n\n*Nota: Esta análise foi realizada utilizando nosso classificador agronômico local.*`
  };
}

// Local Purchase Invoice Parser Fallback
function localInvoiceProcessor() {
  const num = Math.floor(100000 + Math.random() * 900000);
  const docNum = `001-003-0${num}`;
  const suppliers = [
    { name: "Agrosilo Santa Catalina S.A.", businessName: "Agrosilo Santa Catalina S.A.", document: "80012345-6", documentType: "RUC" },
    { name: "Cooperativa Colonias Unidas", businessName: "Cooperativa Colonias Unidas Agropec", document: "80045678-2", documentType: "RUC" },
    { name: "Dekalpar S.A.", businessName: "Dekalpar S.A. Insumos Agrícolas", document: "80098765-1", documentType: "RUC" }
  ];
  const selectedSupplier = suppliers[Math.floor(Math.random() * suppliers.length)];

  const productsPool = [
    { name: "Adubo NPK 12-12-17", sku: "ADUBO-NPK-12", quantity: 50, unitPrice: 240000, unit: "sc", taxType: "IVA_10" },
    { name: "Semente de Soja Syngenta", sku: "SEM-SOJA-SYN", quantity: 20, unitPrice: 480000, unit: "sc", taxType: "IVA_5" },
    { name: "Glifosato Roundup Control", sku: "DEF-GLI-ROUND", quantity: 15, unitPrice: 85000, unit: "l", taxType: "IVA_10" }
  ];

  // Pick 1 or 2 products
  const count = Math.floor(Math.random() * 2) + 1;
  const items: any[] = [];
  for (let i = 0; i < count; i++) {
    items.push(productsPool[(Math.floor(Math.random() * productsPool.length) + i) % productsPool.length]);
  }

  return {
    documentNumber: docNum,
    timbrado: "12345678",
    issuedAt: new Date().toISOString().split("T")[0],
    currency: "PYG",
    exchangeRate: 1,
    supplier: selectedSupplier,
    items: items,
    paymentMethod: Math.random() > 0.5 ? "A_VISTA" : "A_PRAZO"
  };
}

export async function POST(req: NextRequest) {
  // Idioma ativo do usuario (cookie definido pelo language-provider): a IA e as
  // mensagens de erro devem sempre usar o mesmo idioma que a interface exibe.
  const locale = resolveLocale(req.cookies.get("NEXT_LOCALE")?.value);
  const langName = localeLanguageName(locale);
  const m = serverMessages(locale);

  const session = await auth();
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: m.notAuthenticated }, { status: 401 });
  }
  const tenantId = session.user.tenantId;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: m.missingApiKey },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { text, image, file, mimeType, purpose, attachmentUrl } = body;
    const fileBase64 = file || image;
    const activePurpose = purpose || (mimeType === "application/pdf" ? "invoice" : "diagnostic");

    // 1. Invoice PDF/Image processing request
    if (activePurpose === "invoice" && fileBase64) {
      let extracted: any = null;

      if (process.env.GEMINI_API_KEY) {
        const prompt = `Você é um leitor especialista em Notas Fiscais e Faturas de Compra (especialmente do Paraguai e América Latina).
Analise o documento anexo (PDF ou Imagem) e extraia as informações necessárias para cadastrar a fatura de compra no sistema ERP.

Atenção especial para Fornecedor (Emissor):
- O fornecedor (supplier) é quem vendeu/emitiu a fatura, não o cliente/receptor (comprador). Tente extrair a Razão Social ou Nome Fantasia e RUC do fornecedor (localizado no cabeçalho do documento). Não utilize os dados da própria empresa receptora da fatura.
- Se houver logo da empresa emitente no topo do documento, use o nome dessa empresa como name/businessName do fornecedor.
- Extraia o e-mail de contato do emissor/fornecedor (ex: 'MARIVONEPRESSI@HOTMAIL.COM') do cabeçalho de dados da empresa fornecedora.

Atenção extrema para números e pontuação (Paraguai/América Latina):
- A quantidade (quantity) e preço unitário (unitPrice) devem ser retornados no formato correto.
- Na fatura original, o ponto '.' é usado como separador de milhar e a vírgula ',' como separador decimal.
- Por exemplo:
  * Uma quantidade '33,75' significa 33.75 (trinta e três ponto setenta e cinco). Você deve retornar como número ou string '33.75' (ou '33,75').
  * Um preço unitário '8.890' em PYG (Guaranis) significa 8890 (oito mil oitocentos e noventa). Você deve retornar como número ou string '8890' (ou '8.890'). NUNCA retorne 8.89 ou 8.890 como um decimal em PYG, pois isso desvalorizaria o produto em 1000x!
  * Um total '300.000' em PYG significa 300000. Retorne como número ou string '300000' (ou '300.000').

Campos a extrair:
- Nro da Fatura (documentNumber): Geralmente no formato XXX-XXX-XXXXXXX.
- Timbrado: Número de 8 dígitos (específico do Paraguai, se disponível).
- Data de Emissão (issuedAt): ISOString no formato YYYY-MM-DD.
- Moeda (currency): "PYG" (Guaranis), "USD" (Dólares) ou "BRL" (Reais).
- Taxa de Câmbio (exchangeRate): se a moeda for PYG, é 1. Se for USD, tente obter a taxa ou use 7800. Se BRL, use 1350.
- Condição de Pagamento (paymentMethod): "A_VISTA" ou "A_PRAZO".
  * Mapeie termos como "Contado", "contado", "a vista", "à vista" obrigatoriamente para "A_VISTA".
  * Mapeie termos como "Crédito", "crédito", "credito", "a prazo", "A Prazo" obrigatoriamente para "A_PRAZO".
- Fornecedor (supplier):
  * name: Nome Fantasia ou Razão Social limpa do emitente.
  * businessName: Razão Social completa do emitente.
  * document: Documento fiscal (RUC, CPF ou CNPJ) do emitente. Tente extrair o RUC do Paraguai (geralmente formato XXXXXXX-X).
  * documentType: Tipo do documento ("RUC" se Paraguai, "CNPJ" ou "CPF" se Brasil, etc.).
  * email: E-mail de contato do emitente/fornecedor (se houver, ex: 'MARIVONEPRESSI@HOTMAIL.COM').
  * phone: Telefone de contato do emitente (se houver).
  * address: Endereço do emitente (se houver).
  * city: Cidade do emitente (se houver).
- Itens da fatura (items): Array contendo para cada produto:
  * name: Nome descritivo do produto ou serviço.
  * sku: SKU ou código do produto (se houver no documento. Se não houver, crie um SKU único amigável baseado no nome do produto, sem espaços ou caracteres especiais, máximo 15 letras, ex: ADUBO-UREIA).
  * quantity: Quantidade (numérica ou string formatada, ex: '33.75' ou '33,75').
  * unitPrice: Preço unitário na moeda especificada no cabeçalho (numérica ou string formatada, ex: '8890' ou '8.890').
  * unit: Unidade de medida (ex: "un", "kg", "l", "sc").
  * taxType: Tipo de IVA ("IVA_10", "IVA_5" ou "EXENTO").

Retorne APENAS um objeto JSON puro no seguinte formato, sem formatação markdown (como \`\`\`json):
{
  "documentNumber": "string ou null",
  "timbrado": "string ou null",
  "issuedAt": "string (YYYY-MM-DD) ou null",
  "currency": "PYG" | "USD" | "BRL",
  "exchangeRate": number | string,
  "paymentMethod": "A_VISTA" | "A_PRAZO",
  "supplier": {
    "name": "string",
    "businessName": "string ou null",
    "document": "string",
    "documentType": "string",
    "email": "string ou null",
    "phone": "string ou null",
    "address": "string ou null",
    "city": "string ou null"
  },
  "items": [
    {
      "name": "string",
      "sku": "string",
      "quantity": number | string,
      "unitPrice": number | string,
      "unit": "string",
      "taxType": "IVA_10" | "IVA_5" | "EXENTO"
    }
  ]
}`;
        const geminiResponse = await callGemini(prompt, fileBase64, mimeType || "application/pdf");
        if (geminiResponse) {
          try {
            const cleanJsonStr = geminiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
            extracted = JSON.parse(cleanJsonStr);
          } catch (e) {
            console.error("Erro ao fazer parse do JSON do Gemini:", e);
          }
        }
      }

      if (!extracted) {
        return NextResponse.json(
          { error: m.invoiceParseFailed },
          { status: 500 }
        );
      }

      // Check / Create Supplier without duplication
      const supplierDoc = extracted.supplier?.document;
      const supplierName = extracted.supplier?.name;

      let supplier: any = null;
      if (supplierDoc) {
        supplier = await prisma.supplier.findFirst({
          where: { tenantId, document: supplierDoc }
        });
      }
      if (!supplier && supplierName) {
        supplier = await prisma.supplier.findFirst({
          where: { tenantId, name: { equals: supplierName, mode: "insensitive" } }
        });
      }

      if (!supplier && supplierName) {
        supplier = await prisma.supplier.create({
          data: {
            tenantId,
            name: supplierName,
            businessName: extracted.supplier.businessName || supplierName,
            document: supplierDoc || null,
            documentType: extracted.supplier.documentType || "RUC",
            email: extracted.supplier.email || null,
            phone: extracted.supplier.phone || null,
            address: extracted.supplier.address || null,
            city: extracted.supplier.city || null,
            isActive: true,
            category: "retail",
            country: "PY"
          }
        });
      } else if (supplier && !supplier.email && extracted.supplier?.email) {
        // Update existing supplier missing email or contact details
        await prisma.supplier.update({
          where: { id: supplier.id },
          data: {
            email: extracted.supplier.email,
            phone: supplier.phone || extracted.supplier.phone || null,
            address: supplier.address || extracted.supplier.address || null,
            city: supplier.city || extracted.supplier.city || null,
          }
        });
      }

      if (!supplier) {
        throw new Error("Não foi possível resolver ou cadastrar o fornecedor da fatura.");
      }

      // Resolve Products without duplication
      const resolvedItems: any[] = [];
      const isPygInvoice = (extracted.currency || "PYG") === "PYG";
      for (const item of extracted.items) {
        let product: any = null;
        if (item.sku) {
          product = await prisma.product.findFirst({
            where: { tenantId, sku: item.sku }
          });
        }
        if (!product && item.name) {
          product = await prisma.product.findFirst({
            where: { tenantId, name: { equals: item.name, mode: "insensitive" } }
          });
        }

        const qty = parseExtractedNumber(item.quantity, false);
        const unitPrice = parseExtractedNumber(item.unitPrice, isPygInvoice);

        if (!product && item.name) {
          const cleanSku = item.sku || `PROD-${item.name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
          const unit = normalizeUnit(item.name, item.unit);
          product = await prisma.product.create({
            data: {
              tenantId,
              sku: cleanSku,
              name: item.name,
              price: new Decimal(unitPrice), // Cost as price (no markup)
              cost: new Decimal(unitPrice),
              currency: extracted.currency || "PYG",
              unit: unit,
              taxType: item.taxType || "IVA_10",
              currentStock: new Decimal(0),
              isActive: true
            }
          });
        }

        if (product) {
          resolvedItems.push({
            productId: product.id,
            quantity: qty,
            unitPrice: unitPrice,
            taxType: item.taxType || product.taxType
          });
        }
      }

      if (resolvedItems.length === 0) {
        throw new Error("Nenhum produto foi resolvido ou criado na fatura.");
      }

      // Convert prices to PYG
      const exchangeRate = extracted.exchangeRate || 1;
      const parsedIssuedAt = extracted.issuedAt ? new Date(extracted.issuedAt) : new Date();
      
      // Calculate dueDate: A_PRAZO gets 30 days default; A_VISTA gets same as issuedAt (so isCredit is false in ledger)
      const dueDate = extracted.paymentMethod === "A_PRAZO"
        ? new Date(parsedIssuedAt.getTime() + 30 * 24 * 60 * 60 * 1000)
        : parsedIssuedAt;

      const invoicePayload = {
        type: "PURCHASE" as const,
        customerId: supplier.id,
        currency: extracted.currency || "PYG",
        exchangeRate: exchangeRate,
        issuedAt: parsedIssuedAt,
        dueDate: dueDate,
        documentNumber: extracted.documentNumber || `FAC-${Math.floor(100000 + Math.random() * 900000)}`,
        timbrado: extracted.timbrado || undefined,
        notes: `Importado via IA em ${new Date().toLocaleDateString()}. Fornecedor: ${supplier.name}. Condição: ${extracted.paymentMethod === "A_PRAZO" ? "A Prazo" : "À Vista"}.`,
        attachmentUrl: attachmentUrl || undefined,
        items: resolvedItems.map(item => {
          const priceInPYG = extracted.currency === "PYG" ? item.unitPrice : item.unitPrice * exchangeRate;
          return {
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: priceInPYG,
            taxType: item.taxType,
            cost: priceInPYG
          };
        })
      };

      const createdInvoice = await createPurchaseInvoice(invoicePayload);

      return NextResponse.json({
        action: "create_purchase_invoice",
        invoiceId: createdInvoice.id,
        message: m.invoiceImported(
          extracted.documentNumber || createdInvoice.id.slice(-6),
          supplier.name,
          extracted.paymentMethod === "A_PRAZO",
          resolvedItems.length
        )
      });
    }

    // 2. Leaf disease image diagnostic request
    if (activePurpose === "diagnostic" && fileBase64) {
      const prompt = "Analise esta imagem de folha/planta. Identifique se há alguma praga ou doença (como Ferrugem Asiática, Oídio, Mancha Alvo, etc.). Retorne o nome da doença detectada, gravidade estimada e as recomendações técnicas agronômicas detalhadas de tratamento. Escreva a resposta inteira em " + langName + ".";
      const geminiResponse = await callGemini(prompt, fileBase64, mimeType || "image/jpeg");
      if (geminiResponse) {
        return NextResponse.json({
          action: "diagnostic",
          message: geminiResponse
        });
      }
      
      return NextResponse.json(
        { error: m.leafDiagnosisFailed },
        { status: 500 }
      );
    }

    // 3. Text command request
    if (text) {
      // Engine nova de tool-calling real (9 módulos novos: frota, talhão, safra, silo, rebanho, certificação).
      // Se o pedido for de um dos 11 cadastros legados (clientes/fornecedores/produtos/faturas/financeiro/
      // safra-talhão-veículo-funcionário-contrato NOVOS), o modelo devolve "__FALLBACK__" e cai pro
      // classificador antigo logo abaixo — nenhum comando que já funcionava deixa de funcionar.
      try {
        const { generateText, stepCountIs } = await import("ai");
        const { farmModel } = await import("@/lib/ai/model");
        const { buildFarmTools } = await import("@/lib/ai/tools");

        const newEngineResult = await generateText({
          model: farmModel(),
          system: `Você é o assistente de IA do AXIS Farm, um ERP agrícola. Responda SEMPRE em ${langName}, independentemente do idioma em que o usuário escreveu.
Você só tem ferramentas para: frota (manutenção/combustível de veículos), talhão (aplicação de insumo/análise de solo/turno de irrigação), safra (consulta de rentabilidade), silo (movimento de estoque de grão), rebanho (pesagem/sanidade/movimentação de gado) e certificações.
Se o pedido do usuário for sobre CLIENTES, FORNECEDORES, PRODUTOS, FATURAS, TRANSAÇÕES FINANCEIRAS, ou CADASTRAR (criar do zero) uma nova safra, talhão, veículo, funcionário ou contrato, responda apenas com o texto exato "__FALLBACK__" e nada mais — esses casos são tratados por outro sistema.
Para tudo que suas ferramentas cobrem (registrar ou consultar), execute diretamente.`,
          messages: [{ role: "user", content: text }],
          tools: buildFarmTools(tenantId),
          stopWhen: stepCountIs(8),
        });

        const finalText = (newEngineResult.text || "").trim();
        if (finalText && finalText !== "__FALLBACK__") {
          return NextResponse.json({ action: "chat", message: finalText });
        }
      } catch (newEngineError) {
        console.error("Erro na engine de tool-calling, usando classificador antigo:", newEngineError);
      }

      // Fallback: classificador antigo (11 ações fixas dos módulos legados)
      let result: any = null;

      const prompt = `Analise a intenção do usuário: "${text}".
Temos as seguintes ações possíveis de cadastro no ERP agrícola:
1. "create_harvest" (Safra): campos { name: string, cropType: "soja"|"milho"|"trigo"|"algodao"|"arroz"|"outro", startDate: ISOString, endDate: ISOString }
2. "create_plot" (Talhão): campos { name: string, area: number, unit: "HECTARE"|"ALQUEIRE", status: "PLANTED"|"FALLOW"|"PREPARING" }
3. "create_vehicle" (Frota): campos { name: string, type: "trator"|"colheitadeira"|"pulverizador"|"caminhao"|"implemento"|"outro", status: "OPERATIONAL"|"MAINTENANCE"|"OUT_OF_SERVICE" }
4. "create_employee" (Funcionário): campos { name: string, role: string, status: "ACTIVE"|"INACTIVE"|"LEAVE" }
5. "create_contract" (Contrato): campos { contractNumber: string, siloName: string, grainType: string, quantity: number, unit: "TON"|"BAG"|"KG", pricePerUnit: number, currency: "USD"|"PYG"|"BRL", notes?: string }
6. "create_product" (Produto): campos { name: string, sku?: string, price: number, cost: number, currency: "PYG"|"USD"|"BRL", unit?: string, currentStock?: number }
7. "create_customer" (Cliente): campos { name: string, document?: string, documentType?: "RUC"|"CI"|"CPF"|"CNPJ", email?: string, phone?: string, address?: string, city?: string }
8. "create_supplier" (Fornecedor): campos { name: string, document?: string, documentType?: "RUC"|"CI"|"CPF"|"CNPJ", email?: string, phone?: string, address?: string, city?: string }
9. "create_finance_transaction" (Transação Financeira/Caixa): campos { type: "RECEIVABLE"|"PAYABLE"|"TRANSFER", entityId?: string, currency: "PYG"|"USD"|"BRL", amount: number, exchangeRate: number, category?: string }
10. "create_purchase_invoice" (Fatura de Compra): campos { supplierName: string, documentNumber?: string, currency: "PYG"|"USD"|"BRL", exchangeRate: number, paymentMethod: "A_VISTA"|"A_PRAZO", items: [{ name: string, sku?: string, quantity: number, unitPrice: number, taxType?: "IVA_10"|"IVA_5"|"EXENTO" }] }
11. "create_sales_invoice" (Fatura de Venda): campos { customerName: string, documentNumber?: string, currency: "PYG"|"USD"|"BRL", exchangeRate: number, paymentMethod: "A_VISTA"|"A_PRAZO", items: [{ name: string, sku?: string, quantity: number, unitPrice: number, taxType?: "IVA_10"|"IVA_5"|"EXENTO" }] }

Atenção especial para Condição de Pagamento (paymentMethod):
- Se o usuário citar termos de condição de pagamento como "contado", "a vista", "à vista", "cash", mapeie "paymentMethod" para "A_VISTA".
- Se o usuário citar "credito", "crédito", "a prazo", "prazo", mapeie "paymentMethod" para "A_PRAZO".

Se a intenção do usuário corresponder a um cadastro, retorne um objeto JSON puro (sem markdown \`\`\`) contendo:
{
  "action": "nome_da_acao",
  "data": { ...campos mapeados... },
  "message": "Mensagem amigável de sucesso em ${langName} explicando o que foi feito"
}
Se for apenas conversa ou dúvida, retorne:
{
  "action": "chat",
  "message": "Sua resposta amigável sobre o sistema AXIS Farm ERP agrícola, escrita em ${langName}"
}`;

      const geminiResponse = await callGemini(prompt);
      if (geminiResponse) {
        try {
          const cleanJsonStr = geminiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
          result = JSON.parse(cleanJsonStr);
        } catch (e) {
          console.error("Erro ao parsear resposta do Gemini:", e);
        }
      }

      if (!result) {
        return NextResponse.json({ error: m.commandParseFailed }, { status: 500 });
      }

      // Execute database actions if detected
      if (result.action === "create_harvest") {
        await prisma.harvest.create({
          data: {
            tenantId,
            name: result.data.name,
            cropType: result.data.cropType,
            startDate: new Date(result.data.startDate || Date.now()),
            endDate: new Date(result.data.endDate || (Date.now() + 120 * 86400000)),
            status: "ACTIVE"
          }
        });
      } else if (result.action === "create_plot") {
        await prisma.plot.create({
          data: {
            tenantId,
            name: result.data.name,
            area: new Decimal(result.data.area),
            unit: result.data.unit || "HECTARE",
            status: result.data.status || "PLANTED"
          }
        });
      } else if (result.action === "create_vehicle") {
        await prisma.vehicle.create({
          data: {
            tenantId,
            name: result.data.name,
            type: result.data.type,
            status: result.data.status || "OPERATIONAL"
          }
        });
      } else if (result.action === "create_employee") {
        await prisma.employee.create({
          data: {
            tenantId,
            name: result.data.name,
            role: result.data.role,
            status: result.data.status || "ACTIVE"
          }
        });
      } else if (result.action === "create_contract") {
        await prisma.contract.create({
          data: {
            tenantId,
            contractNumber: result.data.contractNumber,
            siloName: result.data.siloName,
            grainType: result.data.grainType,
            quantity: new Decimal(result.data.quantity),
            unit: result.data.unit || "TON",
            pricePerUnit: new Decimal(result.data.pricePerUnit),
            currency: result.data.currency || "USD",
            status: result.data.status || "ACTIVE",
            notes: result.data.notes || null,
            harvestId: result.data.harvestId === "none" || !result.data.harvestId ? null : result.data.harvestId
          }
        });
      } else if (result.action === "create_product") {
        const sku = result.data.sku || `PROD-${result.data.name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
        const isPyg = (result.data.currency || "PYG") === "PYG";
        const price = parseExtractedNumber(result.data.price, isPyg);
        const cost = parseExtractedNumber(result.data.cost, isPyg);
        const currentStock = parseExtractedNumber(result.data.currentStock, false);
        await prisma.product.create({
          data: {
            tenantId,
            sku,
            name: result.data.name,
            price: new Decimal(price || 0),
            cost: new Decimal(cost || 0),
            currency: result.data.currency || "PYG",
            unit: result.data.unit || "un",
            currentStock: new Decimal(currentStock || 0),
            isActive: true
          }
        });
      } else if (result.action === "create_customer") {
        await prisma.customer.create({
          data: {
            tenantId,
            name: result.data.name,
            document: result.data.document || null,
            documentType: result.data.documentType || "RUC",
            email: result.data.email || null,
            phone: result.data.phone || null,
            address: result.data.address || null,
            city: result.data.city || null,
            isActive: true
          }
        });
      } else if (result.action === "create_supplier") {
        await prisma.supplier.create({
          data: {
            tenantId,
            name: result.data.name,
            businessName: result.data.businessName || result.data.name,
            document: result.data.document || null,
            documentType: result.data.documentType || "RUC",
            email: result.data.email || null,
            phone: result.data.phone || null,
            address: result.data.address || null,
            city: result.data.city || null,
            isActive: true
          }
        });
      } else if (result.action === "create_finance_transaction") {
        const amount = Number(result.data.amount || 0);
        const exchangeRate = Number(result.data.exchangeRate || 1);
        await prisma.transaction.create({
          data: {
            tenantId,
            type: result.data.type || "PAYABLE",
            entityId: result.data.entityId || "Geral",
            currency: result.data.currency || "PYG",
            amount: new Decimal(amount),
            exchangeRate: new Decimal(exchangeRate),
            totalPyg: new Decimal(result.data.currency === "PYG" ? amount : amount * exchangeRate),
            category: result.data.category || "Outros"
          }
        });
      } else if (result.action === "create_purchase_invoice") {
        const supplierName = result.data.supplierName;
        let supplier = await prisma.supplier.findFirst({
          where: { tenantId, name: { equals: supplierName, mode: "insensitive" } }
        });
        if (!supplier) {
          supplier = await prisma.supplier.create({
            data: {
              tenantId,
              name: supplierName,
              businessName: supplierName,
              isActive: true,
              category: "retail",
              country: "PY"
            }
          });
        }

        const resolvedItems: any[] = [];
        const isPygInvoiceText = (result.data.currency || "PYG") === "PYG";
        for (const item of result.data.items) {
          let product = await prisma.product.findFirst({
            where: { tenantId, name: { equals: item.name, mode: "insensitive" } }
          });

          const qty = parseExtractedNumber(item.quantity, false);
          const unitPrice = parseExtractedNumber(item.unitPrice, isPygInvoiceText);

          if (!product) {
            const cleanSku = item.sku || `PROD-${item.name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
            const unit = normalizeUnit(item.name, item.unit);
            product = await prisma.product.create({
              data: {
                tenantId,
                sku: cleanSku,
                name: item.name,
                price: new Decimal(unitPrice), // Cost as price (no markup)
                cost: new Decimal(unitPrice),
                currency: result.data.currency || "PYG",
                unit: unit,
                taxType: item.taxType || "IVA_10",
                currentStock: new Decimal(0),
                isActive: true
              }
            });
          }

          resolvedItems.push({
            productId: product.id,
            quantity: qty,
            unitPrice: unitPrice,
            taxType: item.taxType || product.taxType
          });
        }

        const exchangeRate = parseExtractedNumber(result.data.exchangeRate || 1, false) || 1;
        const parsedIssuedAt = new Date();
        const dueDate = result.data.paymentMethod === "A_PRAZO"
          ? new Date(parsedIssuedAt.getTime() + 30 * 24 * 60 * 60 * 1000)
          : parsedIssuedAt;

        const invoicePayload = {
          type: "PURCHASE" as const,
          customerId: supplier.id,
          currency: result.data.currency || "PYG",
          exchangeRate: exchangeRate,
          issuedAt: parsedIssuedAt,
          dueDate: dueDate,
          documentNumber: result.data.documentNumber || `FAC-${Math.floor(100000 + Math.random() * 900000)}`,
          notes: `Registrado via comando de texto IA em ${new Date().toLocaleDateString()}. Condição: ${result.data.paymentMethod === "A_PRAZO" ? "A Prazo" : "À Vista"}.`,
          items: resolvedItems.map(item => {
            const priceInPYG = result.data.currency === "PYG" ? item.unitPrice : item.unitPrice * exchangeRate;
            return {
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: priceInPYG,
              taxType: item.taxType,
              cost: priceInPYG
            };
          })
        };

        await createPurchaseInvoice(invoicePayload);
      } else if (result.action === "create_sales_invoice") {
        const customerName = result.data.customerName;
        let customer = await prisma.customer.findFirst({
          where: { tenantId, name: { equals: customerName, mode: "insensitive" } }
        });
        if (!customer) {
          customer = await prisma.customer.create({
            data: {
              tenantId,
              name: customerName,
              isActive: true,
              category: "retail",
              country: "PY"
            }
          });
        }

        const resolvedItems: any[] = [];
        const isPygInvoiceText = (result.data.currency || "PYG") === "PYG";
        for (const item of result.data.items) {
          let product = await prisma.product.findFirst({
            where: { tenantId, name: { equals: item.name, mode: "insensitive" } }
          });

          const qty = parseExtractedNumber(item.quantity, false);
          const unitPrice = parseExtractedNumber(item.unitPrice, isPygInvoiceText);

          if (!product) {
            const cleanSku = item.sku || `PROD-${item.name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
            const unit = normalizeUnit(item.name, item.unit);
            product = await prisma.product.create({
              data: {
                tenantId,
                sku: cleanSku,
                name: item.name,
                price: new Decimal(unitPrice),
                cost: new Decimal(unitPrice * 0.7),
                currency: result.data.currency || "PYG",
                unit: unit,
                taxType: item.taxType || "IVA_10",
                currentStock: new Decimal(qty),
                isActive: true
              }
            });
          } else if (Number(product.currentStock) < qty) {
            const needed = qty - Number(product.currentStock);
            await prisma.product.update({
              where: { id: product.id },
              data: { currentStock: { increment: needed } }
            });
          }

          resolvedItems.push({
            productId: product.id,
            quantity: qty,
            unitPrice: unitPrice,
            taxType: item.taxType || product.taxType
          });
        }

        const exchangeRate = result.data.exchangeRate || 1;
        const parsedIssuedAt = new Date();
        const dueDate = result.data.paymentMethod === "A_PRAZO"
          ? new Date(parsedIssuedAt.getTime() + 30 * 24 * 60 * 60 * 1000)
          : parsedIssuedAt;

        const invoicePayload = {
          type: "SALES" as const,
          customerId: customer.id,
          currency: result.data.currency || "PYG",
          exchangeRate: exchangeRate,
          issuedAt: parsedIssuedAt,
          dueDate: dueDate,
          documentNumber: result.data.documentNumber || undefined,
          notes: `Registrado via comando de texto IA em ${new Date().toLocaleDateString()}. Condição: ${result.data.paymentMethod === "A_PRAZO" ? "A Prazo" : "À Vista"}.`,
          items: resolvedItems.map(item => {
            const priceInPYG = result.data.currency === "PYG" ? item.unitPrice : item.unitPrice * exchangeRate;
            return {
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: priceInPYG,
              taxType: item.taxType,
              cost: priceInPYG * 0.7
            };
          })
        };

        await createSalesInvoice(invoicePayload);
      }

      return NextResponse.json({
        action: result.action,
        message: result.message
      });
    }

    return NextResponse.json({ error: m.emptyPrompt }, { status: 400 });
  } catch (err: any) {
    console.error("AI Route error:", err);
    return NextResponse.json({ error: err.message || "Erro no processamento da IA" }, { status: 500 });
  }
}
