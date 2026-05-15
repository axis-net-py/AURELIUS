import { useCurrencyStore } from '@/store/useCurrencyStore'
import { CURRENCY_CONFIG, type Currency } from '@/lib/currency'

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrencyStore()
  const currencies: Currency[] = ['BRL', 'USD', 'PYG']

  return (
    <div className="flex items-center bg-muted rounded-full p-1 gap-1">
      {currencies.map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            currency === c
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>{CURRENCY_CONFIG[c].flag}</span>
          <span>{c}</span>
        </button>
      ))}
    </div>
  )
}
