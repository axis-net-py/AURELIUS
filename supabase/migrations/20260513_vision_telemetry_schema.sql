# Database Schema Migration: Vision and Telemetry

```sql
-- Machinery Telemetry
CREATE TABLE machinery_telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machinery_id UUID REFERENCES machinery(id),
  fuel_rate FLOAT,
  engine_load FLOAT,
  speed FLOAT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Field Diagnoses
CREATE TABLE field_diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID REFERENCES fields(id),
  image_url TEXT,
  ai_diagnosis TEXT,
  latitude FLOAT,
  longitude FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
