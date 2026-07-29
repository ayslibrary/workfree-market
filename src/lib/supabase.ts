import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wsrxpwntlpesdqygkujx.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indzcnhwd250bHBlc2RxeWdrdWp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MzI0NDgsImV4cCI6MjA3ODEwODQ0OH0.p41xlDYuxltDdEsq9icIn_FGX4lEi3DIV0TcpBaLL4o";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
