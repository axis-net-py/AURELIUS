-- Phase 3 Migrations: Inventory

-- 1. Inventory Items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  unit TEXT,
  min_threshold NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Inventory Moves table
CREATE TABLE IF NOT EXISTS inventory_moves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  type TEXT CHECK (type IN ('entry', 'exit')),
  quantity NUMERIC NOT NULL,
  cost NUMERIC,
  linked_expense_id UUID REFERENCES expenses(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_moves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see inventory of their farms" ON inventory_items FOR ALL USING (
  farm_id IN (SELECT farm_id FROM user_roles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can see inventory moves of their items" ON inventory_moves FOR ALL USING (
  item_id IN (SELECT id FROM inventory_items WHERE farm_id IN (SELECT farm_id FROM user_roles WHERE user_id = auth.uid()))
);
