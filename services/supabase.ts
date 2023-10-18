import { Database } from "@/database.types";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iuuvmpwapifphdxjnufe.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient<Database>(supabaseUrl, SUPABASE_KEY!);

export default supabase;
