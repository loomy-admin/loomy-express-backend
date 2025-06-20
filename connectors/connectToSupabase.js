const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const logger = require('./logger');

const connectToSupabase = () => {
    const supabaseUrl = process.env.SUPABASE_URL; // e.g., https://xyzcompany.supabase.co
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // or anon key, based on use case

    const options = {
        db: {
            schema: 'public',
        },
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        },
        global: {
            headers: { 'x-my-custom-header': 'loomy-app' },
        },
    };

    try {
        const supabase = createClient(supabaseUrl, supabaseKey, options);
        logger.info('Connected to Supabase Client - Loomy');
        return supabase;
    } catch (err) {
        logger.error('Could not create Supabase client - Loomy', err);
        throw err;
    }
};

module.exports = connectToSupabase;
