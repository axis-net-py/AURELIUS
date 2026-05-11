-- 20260509_initial_schema.sql

-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Farms table
CREATE TABLE IF NOT EXISTS farms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id),
  cnpj TEXT,
  address TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Roles table (RBAC)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'manager', 'operator')),
  UNIQUE(farm_id, user_id)
);

-- Fields table
CREATE TABLE IF NOT EXISTS fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  area_ha NUMERIC NOT NULL,
  soil_type TEXT,
  coordinates JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crop Seasons table
CREATE TABLE IF NOT EXISTS crop_seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  crop TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'harvested', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  field_id UUID REFERENCES fields(id),
  season_id UUID REFERENCES crop_seasons(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  supplier TEXT,
  payment_method TEXT,
  notes TEXT,
  receipt_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenues table
CREATE TABLE IF NOT EXISTS revenues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  field_id UUID REFERENCES fields(id),
  season_id UUID REFERENCES crop_seasons(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC NOT NULL,
  commodity TEXT NOT NULL,
  quantity_tons NUMERIC,
  price_per_unit NUMERIC,
  buyer TEXT,
  invoice_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenues ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User Roles: users can see their own roles
CREATE POLICY "Users can see their own roles"
ON user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Farms: users can see farms they belong to
CREATE POLICY "Users can see farms they belong to"
ON farms FOR SELECT
USING (
  id IN (
    SELECT farm_id FROM user_roles WHERE user_id = auth.uid()
  )
);

-- Fields: users can see/manage fields of their farms
CREATE POLICY "Users can see fields of their farms"
ON fields FOR SELECT
USING (
  farm_id IN (
    SELECT farm_id FROM user_roles WHERE user_id = auth.uid()
  )
);

-- Expenses: users can see/manage expenses of their farms
CREATE POLICY "Users can see expenses of their farms"
ON expenses FOR SELECT
USING (
  farm_id IN (
    SELECT farm_id FROM user_roles WHERE user_id = auth.uid()
  )
);

-- Revenues: users can see/manage revenues of their farms
CREATE POLICY "Users can see revenues of their farms"
ON revenues FOR SELECT
USING (
  farm_id IN (
    SELECT farm_id FROM user_roles WHERE user_id = auth.uid()
  )
);
