import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON, SUPABASE_URL } from "./constants";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

export default supabase;
