import { createClient } from '@supabase/supabase-js'
import { Database } from "./database.types";
const supabase = createClient<Database>(
   "https://pjaythugyatlthozuark.supabase.co",
   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqYXl0aHVneWF0bHRob3p1YXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMTcwODIsImV4cCI6MjA1NzU5MzA4Mn0.nCE72HK3tQGCQj3HmY0g_WQEv7HSnZ3amIBdat0fOJM",
);

/*
const supabase = createClient<Database>(
   process.env.SUPABASE_URL,
   process.env.SUPABASE_SERVICE_ROLE
);
*/
export default supabase;
