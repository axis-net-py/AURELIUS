import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://kyrqcvkaaewhjrmxhhzq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5cnFjdmthYWV3aGpybXhoaHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MjE0NDUsImV4cCI6MjA5Mzk5NzQ0NX0.ZgmGGBESxjjZGFfTm6UhjNrZpmYqCfoSnESOwXA-5YM'
)
