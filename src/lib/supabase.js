import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://clbsdbvqoemhfkhjjxeh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_iGHafy78evXFMbsSTNL6qw__kF2tSYM';

export const supabase = createClient(supabaseUrl, supabaseKey);
