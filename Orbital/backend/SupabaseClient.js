import { createClient} from '@supabase/supabase-js'

const supabaseUrl = 'https://kxnlizpknzmmqholwkko.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bmxpenBrbnptbXFob2x3a2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MTU3ODQsImV4cCI6MjA2NDk5MTc4NH0.8GJazyBYuzUMKuImcWuTQeGSyBmTkuKDLqwK2AP4dL8'

export const supabase = createClient(supabaseUrl, supabaseKey)
