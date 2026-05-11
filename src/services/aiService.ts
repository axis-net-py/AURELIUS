import Anthropic from '@anthropic-ai/sdk';
import { fieldService } from './fieldService';
import { expenseService } from './expenseService'; // Assuming this exists or will be created
import { seasonService } from './seasonService';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
  dangerouslyAllowBrowser: true,
});

export interface ParsedAgroData {
  intent: 'EXPENSE' | 'HARVEST' | 'FUEL' | 'MAINTENANCE' | 'STOCK';
  data: any;
  confidence: number;
}

export const aiService = {
  parseAgroIntent: async (input: string): Promise<ParsedAgroData> => {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1000,
      temperature: 0,
      system: `Você é um assistente de gestão agrícola profissional. 
      Sua tarefa é extrair dados estruturados de mensagens de texto ou áudio transcrito.
      
      Regras de Extração:
      1. Retorne APENAS um objeto JSON válido.
      2. Campos obrigatórios: intent, data, confidence.
      3. Intents suportados:
         - EXPENSE: Para compras de insumos, pagamentos, peças. (campos: amount, description, category, field_name?)
         - HARVEST: Para registro de colheita. (campos: amount, unit, crop, field_name)
         - FUEL: Para abastecimento de máquinas. (campos: liters, amount?, machinery_name, field_name?)
         - MAINTENANCE: Manutenção de máquinas. (campos: machinery_name, description, cost?)
         - STOCK: Entrada ou saída de estoque. (campos: item_name, quantity, type: 'IN'|'OUT')
      
      Exemplo: "Gastei 500 reais em sementes para o Talhão Norte"
      Resposta: { "intent": "EXPENSE", "data": { "amount": 500, "category": "SEEDS", "field_name": "Talhão Norte", "description": "Sementes" }, "confidence": 0.95 }`,
      messages: [{ role: 'user', content: input }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return JSON.parse(content.text);
    }
    throw new Error('Unexpected response format from AI');
  },

  resolveAndSave: async (parsedData: ParsedAgroData, farmId: string) => {
    // 1. Resolve Field ID if field_name exists
    if (parsedData.data.field_name) {
      const fields = await fieldService.getFields(farmId);
      const field = fields.find(f => 
        f.name.toLowerCase().includes(parsedData.data.field_name.toLowerCase()) ||
        parsedData.data.field_name.toLowerCase().includes(f.name.toLowerCase())
      );
      if (field) {
        parsedData.data.field_id = field.id;
      }
    }

    // 2. Route to specific service based on intent
    switch (parsedData.intent) {
      case 'EXPENSE':
        // await expenseService.createExpense({ ...parsedData.data, farm_id: farmId });
        console.log('Saving Expense:', parsedData.data);
        break;
      case 'HARVEST':
        console.log('Saving Harvest:', parsedData.data);
        break;
      case 'FUEL':
        console.log('Saving Fuel Log:', parsedData.data);
        break;
      default:
        console.log('Unknown intent or not implemented:', parsedData.intent);
    }
    
    return parsedData;
  }
};
