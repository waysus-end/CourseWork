import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dyjewswvutsrecuimbss.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5amV3c3d2dXRzcmVjdWltYnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MTc3ODcsImV4cCI6MjA5MTI5Mzc4N30.iVpB6OSxbyEdmcNPByb8xwly21gq8-04L4vP4MAvVhE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ========== ID ПОЛЬЗОВАТЕЛЯ ==========
export const getUserId = () => {
  let userId = localStorage.getItem('supabase_user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('supabase_user_id', userId);
  }
  return userId;
};