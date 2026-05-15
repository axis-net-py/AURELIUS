-- Phase 6: Harvest and Sales
CREATE TABLE IF NOT EXISTS harvest_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
  crop_season_id UUID REFERENCES crop_seasons(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  quantity NUMERIC NOT NULL,
  moisture NUMERIC,
  storage_location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  crop_season_id UUID REFERENCES crop_seasons(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  quantity_sold NUMERIC NOT NULL,
  price_per_unit NUMERIC NOT NULL,
  total_value NUMERIC NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE harvest_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage harvest records of their farms" ON harvest_records FOR ALL USING (
  farm_id IN (SELECT farm_id FROM user_roles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage sales contracts of their farms" ON sales_contracts FOR ALL USING (
  farm_id IN (SELECT farm_id FROM user_roles WHERE user_id = auth.uid())
);
