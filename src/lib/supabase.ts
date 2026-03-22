import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vyfangkmnlwlttnwmahk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5ZmFuZ2ttbmx3bHR0bndtYWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MTIxODYsImV4cCI6MjA4ODI4ODE4Nn0.uzKLTqrjyMHzg2UOp2Jjy0L2DmpoN8ZJbHTdnh3_EDo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
