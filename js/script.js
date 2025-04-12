import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://cikjhhbwxobypgofavuj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpa2poaGJ3eG9ieXBnb2ZhdnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTQ2MjYsImV4cCI6MjA1OTYzMDYyNn0.t1tegLTbzqX75EUdo1BboKgudq6SggYkshOM-6d2oEo';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Funzione per caricare le date disponibili
const loadDates = async () => {
    try {
        const { data: availability, error } = await supabaseClient
            .from('availability')
            .select('date');

        if (error) {
            console.error('Errore nel caricamento delle date:', error);
            return;
        }

        const uniqueDates = [...new Set(availability.map(item => item.date))];
        const dateSelect = document.getElementById('date');
        dateSelect.innerHTML = uniqueDates.map(date => `
            <option value="${date}">${date}</option>
        `).join('');
    } catch (err) {
        console.error('Errore imprevisto durante il caricamento delle date:', err);
    }
};

// Funzione per caricare gli orari disponibili per una data selezionata
const loadTimesForDate = async (selectedDate) => {
    try {
        const { data: availability, error: availabilityError } = await supabaseClient
            .from('availability')
            .select('time')
            .eq('date', selectedDate);

        if (availabilityError) {
            console.error('Errore nel caricamento degli orari disponibili:', availabilityError);
            return;
        }

        const { data: bookedAppointments, error: appointmentsError } = await supabaseClient
            .from('appointments')
            .select('time')
            .eq('date', selectedDate);

        if (appointmentsError) {
            console.error('Errore nel caricamento degli appuntamenti:', appointmentsError);
            return;
        }

        const bookedTimes = bookedAppointments.map(appointment => appointment.time);
        const filteredTimes = availability.filter(item => !bookedTimes.includes(item.time));

        const timeSelect = document.getElementById('time');
        timeSelect.innerHTML = filteredTimes.map(item => `
            <option value="${item.time}">${item.time}</option>
        `).join('');
        timeSelect.disabled = false;
    } catch (err) {
        console.error('Errore imprevisto durante il caricamento degli orari:', err);
    }
};

// Aggiungi un listener per aggiornare gli orari quando cambia la data
document.getElementById('date').addEventListener('change', async (event) => {
    const selectedDate = event.target.value;
    await loadTimesForDate(selectedDate);
});

// Funzione per gestire la prenotazione
document.getElementById('booking-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const client_name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const notes = document.getElementById('notes').value;

    try {
        const { error } = await supabaseClient
            .from('appointments')
            .insert([{ client_name, phone, date, time, notes }]);

        if (error) {
            console.error('Errore durante la prenotazione:', error);
            document.getElementById('booking-message').textContent = 'Errore durante la prenotazione. Riprova.';
            return;
        }

        document.getElementById('booking-form').reset();
        document.getElementById('booking-message').textContent = 'Prenotazione effettuata con successo!';
        await loadDates();
        await loadTimesForDate(date);
    } catch (err) {
        console.error('Errore imprevisto durante la prenotazione:', err);
        document.getElementById('booking-message').textContent = 'Errore imprevisto. Riprova.';
    }
});

// Carica i dati iniziali
document.addEventListener('DOMContentLoaded', async () => {
    await loadDates();
});
