export type Currency = 'BRL' | 'USD' | 'PYG'

export const CURRENCY_CONFIG = {
  BRL: { symbol: 'R$', locale: 'pt-BR', flag: '🇧🇷', name: 'Real' },
  USD: { symbol: 'US$', locale: 'en-US', flag: '🇺🇸', name: 'Dólar' },
  PYG: { symbol: '₲', locale: 'es-PY', flag: '🇵🇾', name: 'Guarani' },
}

// Static fallback rates (updated manually or via API later)
// Base: BRL
export const EXCHANGE_RATES: Record<Currency, number> = {
  BRL: 1,
  USD: 0.18,      // 1 BRL = ~0.18 USD
  PYG: 1350,      // 1 BRL = ~1350 PYG
}

export function convertFromBRL(valueBRL: number, to: Currency): number {
  return valueBRL * EXCHANGE_RATES[to]
}

export function formatCurrency(valueBRL: number, currency: Currency): string {
  const converted = convertFromBRL(valueBRL, currency)
  const { locale, symbol } = CURRENCY_CONFIG[currency]
  
  if (currency === 'PYG') {
    // Guarani has no decimals
    return `${symbol} ${new Intl.NumberFormat(locale, { 
      maximumFractionDigits: 0 
    }).format(converted)}`
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(converted)
}
