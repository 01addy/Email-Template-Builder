const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://lyhalmecwdzmimujmxho.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5aGFsbWVjd2R6bWltdWpteGhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczMDY2NDUsImV4cCI6MjA1Mjg4MjY0NX0.o7nEVGB0zdpibNlow70wLQLJ1WXVRZmSI8bD0hxjHu8';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchData() {
  const { data, error } = await supabase.from('templates').select('*');
  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log('Supabase connection successful:', data);
  }
}

fetchData();
