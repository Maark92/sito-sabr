import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://cikjhhbwxobypgofavuj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpa2poaGJ3eG9ieXBnb2ZhdnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTQ2MjYsImV4cCI6MjA1OTYzMDYyNn0.t1tegLTbzqX75EUdo1BboKgudq6SggYkshOM-6d2oEo'

export const supabaseClient = createClient(supabaseUrl, supabaseKey)
