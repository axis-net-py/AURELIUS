-- Phase 5: Field Operations
CREATE TABLE IF NOT EXISTS field_operations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
  crop_season_id UUID REFERENCES crop_seasons(id) ON DELETE CASCADE,
  machinery_id UUID REFERENCES machinery(id),
  operation_type TEXT NOT NULL CHECK (operation_type IN ('Planting', 'Spraying', 'Fertilizing', 'Harvesting')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS operation_inputs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operation_id UUID REFERENCES field_operations(id) ON DELETE CASCADE,
  inventory_item_id UUID REFERENCES inventory_items(id),
  quantity_used NUMERIC NOT NULL,
  cost_at_time NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deduct Inventory Trigger
CREATE OR REPLACE FUNCTION deduct_inventory()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE inventory_items
  SET quantity = quantity - NEW.quantity_used
  WHERE id = NEW.inventory_item_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_deduct_inventory
AFTER INSERT ON operation_inputs
FOR EACH ROW EXECUTE FUNCTION deduct_inventory();

-- RLS
ALTER TABLE field_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE operation_inputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage field operations of their farms" ON field_operations FOR ALL USING (
  farm_id IN (SELECT farm_id FROM user_roles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage operation inputs of their farms" ON operation_inputs FOR ALL USING (
  operation_id IN (SELECT id FROM field_operations WHERE farm_id IN (SELECT farm_id FROM user_roles WHERE user_id = auth.uid()))
);
