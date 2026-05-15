-- Migration: Create field_scouting table
CREATE TABLE IF NOT EXISTS field_scouting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID REFERENCES fields(id),
  image_url TEXT,
  ai_diagnosis TEXT,
  confidence_level FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
