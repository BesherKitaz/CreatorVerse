import { createClient } from '@supabase/supabase-js';

const URL = "https://xunbnxtcbwxhpyhhmnrf.supabase.co";
const API_KEY = "sb_publishable_rxJErGBoMhLe_PJ3ZmeQig_0WLb66wC";

export const supabase = createClient(URL, API_KEY);

