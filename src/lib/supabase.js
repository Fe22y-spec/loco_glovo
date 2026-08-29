import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rwevslisctwexarloeqk.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3ZXZzbGlzY3R3ZXhhcmxvZXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxMzg5MTYsImV4cCI6MjEwMDcxNDkxNn0.ocMGBG7b1Bkrf8gOX8hHH29zxJ7v5df_HWbvzac5f-M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
