-- Phase 4: Productive Fields and Seasons
CREATE TABLE IF NOT EXISTS fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  area_hectares NUMERIC NOT NULL,
  soil_type TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crop_seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS field_crops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
  season_id UUID REFERENCES crop_seasons(id) ON DELETE CASCADE,
  crop_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_crops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage fields of their farms" ON fields FOR ALL USING (
  farm_id IN (SELECT farm_id FROM user_roles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage crop seasons of their farms" ON crop_seasons FOR ALL USING (
  farm_id IN (SELECT farm_id FROM user_roles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage field crops of their farms" ON field_crops FOR ALL USING (
  field_id IN (SELECT id FROM fields WHERE farm_id IN (SELECT farm_id FROM user_roles WHERE user_id = auth.uid()))
);
