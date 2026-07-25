/**
 * Mensagens geradas no servidor (rotas de API, respostas da IA, erros).
 *
 * Os componentes de UI usam next-intl (`useTranslations`) com os arquivos em
 * `src/messages/*.json`. Rotas de API não têm acesso ao contexto do React, então
 * resolvem o idioma pelo cookie `NEXT_LOCALE` e usam este catálogo.
 */

export type AppLocale = "pt-BR" | "es-PY";

/** Normaliza um valor de cookie/header para um locale suportado. */
export function resolveLocale(raw: string | undefined | null): AppLocale {
  return raw === "es-PY" ? "es-PY" : "pt-BR";
}

/** Nome do idioma usado nas instruções enviadas ao modelo de IA. */
export function localeLanguageName(locale: AppLocale): string {
  return locale === "es-PY" ? "español (de Paraguay)" : "português (do Brasil)";
}

const messages = {
  "pt-BR": {
    notAuthenticated: "Não autenticado",
    emptyPrompt: "Prompt vazio",
    missingApiKey:
      "A chave GEMINI_API_KEY não está configurada no servidor. A IA integrada precisa da chave para processar comandos reais.",
    invoiceParseFailed:
      "Não foi possível analisar ou extrair os dados estruturados da fatura usando a IA do Gemini.",
    leafDiagnosisFailed: "Falha na análise de diagnóstico de folhas pelo Gemini.",
    commandParseFailed: "Falha ao interpretar o comando do assistente de IA.",
    invoiceImported: (
      docNumber: string,
      supplierName: string,
      onCredit: boolean,
      itemCount: number
    ) =>
      `Fatura de compra #${docNumber} do fornecedor "${supplierName}" (${onCredit ? "A Prazo" : "À Vista"}) importada com sucesso via IA! Foram cadastrados/associados ${itemCount} produtos sem duplicidades.`,
  },
  "es-PY": {
    notAuthenticated: "No autenticado",
    emptyPrompt: "Consulta vacía",
    missingApiKey:
      "La clave GEMINI_API_KEY no está configurada en el servidor. La IA integrada necesita la clave para procesar comandos reales.",
    invoiceParseFailed:
      "No fue posible analizar ni extraer los datos estructurados de la factura usando la IA de Gemini.",
    leafDiagnosisFailed: "Fallo en el análisis de diagnóstico de hojas por Gemini.",
    commandParseFailed: "Fallo al interpretar el comando del asistente de IA.",
    invoiceImported: (
      docNumber: string,
      supplierName: string,
      onCredit: boolean,
      itemCount: number
    ) =>
      `¡Factura de compra #${docNumber} del proveedor "${supplierName}" (${onCredit ? "A Crédito" : "Al Contado"}) importada con éxito mediante IA! Se registraron/asociaron ${itemCount} productos sin duplicados.`,
  },
} as const;

/** Catálogo de mensagens do servidor para o idioma informado. */
export function serverMessages(locale: AppLocale) {
  return messages[locale];
}
