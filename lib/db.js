const { createClient } = require('@supabase/supabase-js');
const env = require('dotenv');

env.config();

const supabaseUrl = process.env.PROJECT_URL || '';
const supabaseKey = process.env.API_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
