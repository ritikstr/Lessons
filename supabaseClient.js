import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://cstdptybgrlxngxislol.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzdGRwdHliZ3JseG5neGlzbG9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMzYwNTUsImV4cCI6MjA3NDkxMjA1NX0.hvOByUM2lnl16UGz0LAL2-8fEDUcwK0_4aBJkC3cNuc"
export const supabase = createClient(supabaseUrl, supabaseKey)
