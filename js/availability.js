import { supabase } from './supabaseClient.js';

async function loadAvailability() {
    const { data, error } = await supabase
        .from('availability')
        .select('*')
        .order('date', { ascending: true }); // ordina per data crescente
    
    if (error) {
        console.error('Error loading availability:', error);
        return;
    }

    // Verifica quante date sono state caricate
    console.log('Numero totale di date caricate:', data.length);

    return data;
}
