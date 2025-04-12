// File JavaScript principale per il sito

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Verifica della sessione utente...');

    // Configurazione di Supabase
    const SUPABASE_URL = 'https://cikjhhbwxobypgofavuj.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpa2poaGJ3eG9ieXBnb2ZhdnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTQ2MjYsImV4cCI6MjA1OTYzMDYyNn0.t1tegLTbzqX75EUdo1BboKgudq6SggYkshOM-6d2oEo'; // Sostituisci con la chiave anonima corretta
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    try {
        // Ottieni la sessione dell'utente
        const { data: { session }, error } = await supabaseClient.auth.getSession();

        if (error) {
            console.error('Errore durante il recupero della sessione:', error);
        }

        if (!session) {
            console.warn('Sessione non trovata. Reindirizzamento al login.');
            window.location.href = 'login.html';
            return;
        }

        console.log('Sessione trovata:', session);

        // Verifica se l'utente è autorizzato
        const authorizedEmail = 'proprietario@email.com'; // Sostituisci con l'email del proprietario
        if (session.user.email !== authorizedEmail) {
            console.warn('Utente non autorizzato:', session.user.email);
            window.location.href = 'login.html';
            return;
        }

        console.log('Utente autorizzato:', session.user.email);

        // Funzione per popolare gli slot di disponibilità
        const populateAvailability = async () => {
            const { data: availability, error } = await supabaseClient
                .from('availability')
                .select('*')
                .order('date', { ascending: true })
                .order('time', { ascending: true });

            if (error) {
                console.error('Errore nel recupero degli slot di disponibilità:', error);
                return;
            }

            const dateInput = document.getElementById('date');
            const timeInput = document.getElementById('time');

            // Popola il campo data con le date disponibili
            const uniqueDates = [...new Set(availability.map(slot => slot.date))];
            dateInput.innerHTML = uniqueDates.map(date => `<option value="${date}">${date}</option>`).join('');

            // Aggiorna gli orari disponibili quando cambia la data
            dateInput.addEventListener('change', () => {
                const selectedDate = dateInput.value;
                const timesForDate = availability.filter(slot => slot.date === selectedDate && !slot.is_booked);
                timeInput.innerHTML = timesForDate.map(slot => `<option value="${slot.time}">${slot.time}</option>`).join('');
            });

            // Trigger iniziale per popolare gli orari della prima data
            dateInput.dispatchEvent(new Event('change'));
        };

        await populateAvailability();

        // Funzione per caricare i trattamenti
        const loadTreatments = async () => {
            const { data: treatments, error } = await supabaseClient
                .from('treatments')
                .select('*');

            if (error) {
                console.error('Errore nel caricamento dei trattamenti:', error);
                return;
            }

            // Popola la sezione "Servizi"
            const serviziList = document.getElementById('servizi-list');
            serviziList.innerHTML = treatments.map(treatment => `
                <div class="servizio">
                    <img src="${treatment.image_url}" alt="${treatment.name}" style="width: 100%; height: auto; border-radius: 8px;">
                    <h3>${treatment.name}</h3>
                    <p>${treatment.description}</p>
                    <p><strong>Prezzo:</strong> €${treatment.price.toFixed(2)}</p>
                </div>
            `).join('');

            // Popola il menu a tendina nel modulo di prenotazione
            const treatmentSelect = document.getElementById('treatment');
            treatmentSelect.innerHTML = treatments.map(treatment => `
                <option value="${treatment.id}">${treatment.name} (€${treatment.price.toFixed(2)})</option>
            `).join('');
        };

        await loadTreatments();

        // Gestione del modulo di prenotazione
        document.getElementById('booking-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const treatmentId = document.getElementById('treatment').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;

            // Salva il cliente nel database
            const { data: client, error: clientError } = await supabaseClient
                .from('clients')
                .insert([{ name, email, phone }])
                .select()
                .single();

            if (clientError) {
                document.getElementById('booking-message').textContent = 'Errore nella prenotazione. Riprova.';
                return;
            }

            // Salva l'appuntamento nel database
            const { error: appointmentError } = await supabaseClient
                .from('appointments')
                .insert([{ client_id: client.id, treatment_id: treatmentId, date, time }]);

            if (appointmentError) {
                document.getElementById('booking-message').textContent = 'Errore nella prenotazione. Riprova.';
                return;
            }

            // Segna lo slot come prenotato
            const { error: updateError } = await supabaseClient
                .from('availability')
                .update({ is_booked: true })
                .eq('date', date)
                .eq('time', time);

            if (updateError) {
                console.error('Errore nell\'aggiornamento dello slot:', updateError);
            }

            document.getElementById('booking-message').textContent = 'Prenotazione effettuata con successo!';
            document.getElementById('booking-form').reset();
        });
    } catch (err) {
        console.error('Errore durante la verifica della sessione:', err);
        window.location.href = 'login.html';
    }
});

// Carica i trattamenti dalla localStorage o dal database
async function loadTreatmentsForHome() {
    const servicesContainer = document.querySelector('.services-container');
    if (!servicesContainer) return;

    try {
        // Prova a caricare i trattamenti dal localStorage
        const cachedTreatments = localStorage.getItem('treatments');
        let treatments = cachedTreatments ? JSON.parse(cachedTreatments) : [];

        // Se non ci sono trattamenti in cache, caricali dal database
        if (!treatments.length) {
            const { data, error } = await supabase
                .from('treatments')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            treatments = data;
        }

        // Mostra i trattamenti
        servicesContainer.innerHTML = treatments.map(treatment => `
            <div class="service-card">
                <img src="${treatment.image_url}" alt="${treatment.name}" class="service-image">
                <h3>${treatment.name}</h3>
                <p>${treatment.description}</p>
                <p class="price">€${treatment.price.toFixed(2)}</p>
            </div>
        `).join('');
    } catch (err) {
        console.error('Errore nel caricamento dei trattamenti:', err);
    }
}

document.addEventListener('DOMContentLoaded', loadTreatmentsForHome);
