-- Phase 3 Migrations: Machinery & Equipment

-- 1. Machinery table
CREATE TABLE IF NOT EXISTS machinery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  brand TEXT,
  model TEXT,
  year INTEGER,
  identifier TEXT,
  current_hours_km NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Machinery Logs table
CREATE TABLE IF NOT EXISTS machinery_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machinery_id UUID REFERENCES machinery(id) ON DELETE CASCADE,
  season_id UUID REFERENCES crop_seasons(id),
  operation_type TEXT,
  date DATE NOT NULL,
  hours_used NUMERIC,
  fuel_liters NUMERIC,
  fuel_cost NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Machinery Maintenance table
CREATE TABLE IF NOT EXISTS machinery_maint (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machinery_id UUID REFERENCES machinery(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT CHECK (type IN ('preventive', 'corrective')),
  description TEXT,
  cost NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE machinery ENABLE ROW LEVEL SECURITY;
ALTER TABLE machinery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE machinery_maint ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see machinery of their farms" ON machinery FOR ALL USING (
  farm_id IN (SELECT farm_id FROM user_roles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can see logs of their machinery" ON machinery_logs FOR ALL USING (
  machinery_id IN (SELECT id FROM machinery WHERE farm_id IN (SELECT farm_id FROM user_roles WHERE user_id = auth.uid()))
);
CREATE POLICY "Users can see maintenance of their machinery" ON machinery_maint FOR ALL USING (
  machinery_id IN (SELECT id FROM machinery WHERE farm_id IN (SELECT farm_id FROM user_roles WHERE user_id = auth.uid()))
);
