import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rwevslisctwexarloeqk.supabase.co";
const supabaseAnonKey =
  "sb_publishable_Bs9p3KO7MUOescWQ2vZpAA_c6I9qM_I";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
