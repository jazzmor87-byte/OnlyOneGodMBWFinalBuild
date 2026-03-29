import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ojsqcearsiqtfwqgzokg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qc3FjZWFyc2lxdGZ3cWd6b2tnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NjIzMzYsImV4cCI6MjA3OTIzODMzNn0.7F0qsU4gV2hw4hn92b53a48emKSYijV-61B7uWTt5B4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);