import { createClient } from '@supabase/supabase-js';
import env from 'dotenv';

env.config();

const supabaseUrl = process.env.PROJECT_URL;
const supabaseKey = process.env.API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
