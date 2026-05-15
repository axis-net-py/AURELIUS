-- Phase 2 Migrations

-- 1. Seeds table
CREATE TABLE IF NOT EXISTS seeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID REFERENCES crop_seasons(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  variety TEXT,
  batch TEXT,
  quantity_kg NUMERIC,
  area_ha NUMERIC,
  cost_total NUMERIC,
  supplier TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Inputs table
CREATE TABLE IF NOT EXISTS inputs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID REFERENCES crop_seasons(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  type TEXT,
  application_date DATE,
  dose_per_ha NUMERIC,
  total_qty NUMERIC,
  total_cost NUMERIC,
  applicator TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Harvests table
CREATE TABLE IF NOT EXISTS harvests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID REFERENCES crop_seasons(id) ON DELETE CASCADE,
  field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  area_ha NUMERIC,
  gross_qty_tons NUMERIC,
  humidity_pct NUMERIC,
  net_qty_tons NUMERIC,
  destination TEXT CHECK (destination IN ('storage', 'sale')),
  sale_price NUMERIC,
  buyer TEXT,
  revenue_id UUID REFERENCES revenues(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE seeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE harvests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see seeds of their farms" ON seeds FOR ALL USING (
  season_id IN (SELECT id FROM crop_seasons WHERE farm_id IN (SELECT farm_id FROM user_roles WHERE user_id = auth.uid()))
);
CREATE POLICY "Users can see inputs of their farms" ON inputs FOR ALL USING (
  season_id IN (SELECT id FROM crop_seasons WHERE farm_id IN (SELECT farm_id FROM user_roles WHERE user_id = auth.uid()))
);
CREATE POLICY "Users can see harvests of their farms" ON harvests FOR ALL USING (
  season_id IN (SELECT id FROM crop_seasons WHERE farm_id IN (SELECT farm_id FROM user_roles WHERE user_id = auth.uid()))
);
