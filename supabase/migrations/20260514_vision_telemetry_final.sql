-- Migration: Vision Scouting and Machinery Telemetry

-- 1. Field Diagnoses (AI diagnosis history)
CREATE TABLE IF NOT EXISTS field_diagnoses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  field_id UUID REFERENCES fields(id) ON DELETE CASCADE,
  image_url TEXT,
  ai_diagnosis TEXT,
  confidence_level NUMERIC,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Machinery Telemetry (Real-time sensor data)
CREATE TABLE IF NOT EXISTS machinery_telemetry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  machinery_id UUID REFERENCES machinery(id) ON DELETE CASCADE,
  fuel_rate NUMERIC,
  engine_load NUMERIC,
  speed NUMERIC,
  latitude NUMERIC,
  longitude NUMERIC,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE field_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE machinery_telemetry ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Users can manage field diagnoses of their farms"
ON field_diagnoses FOR ALL
USING (
  farm_id IN (
    SELECT farm_id FROM user_roles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage machinery telemetry of their farms"
ON machinery_telemetry FOR ALL
USING (
  farm_id IN (
    SELECT farm_id FROM user_roles WHERE user_id = auth.uid()
  )
);

-- 5. Performance Indices
CREATE INDEX IF NOT EXISTS idx_field_diagnoses_farm_id ON field_diagnoses(farm_id);
CREATE INDEX IF NOT EXISTS idx_field_diagnoses_field_id ON field_diagnoses(field_id);
CREATE INDEX IF NOT EXISTS idx_machinery_telemetry_farm_id ON machinery_telemetry(farm_id);
CREATE INDEX IF NOT EXISTS idx_machinery_telemetry_machinery_id ON machinery_telemetry(machinery_id);
