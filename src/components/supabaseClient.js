import { createClient } from '@supabase/supabase-js';

const supabaseApi = process.env.REACT_APP_SUPABASE_API_URI
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY

export const supabase = createClient(supabaseApi, supabaseKey);
