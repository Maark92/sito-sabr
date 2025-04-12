import { supabaseClient } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Configurazione di Supabase
    const SUPABASE_URL = 'https://cikjhhbwxobypgofavuj.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpa2poaGJ3eG9ieXBnb2ZhdnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTQ2MjYsImV4cCI6MjA1OTYzMDYyNn0.t1tegLTbzqX75EUdo1BboKgudq6SggYkshOM-6d2oEo'; // Sostituisci con la chiave anonima corretta
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Funzione per caricare i clienti
    const loadClients = async () => {
        const { data: clients, error } = await supabaseClient
            .from('clients')
            .select('*');

        if (error) {
            console.error('Errore nel caricamento dei clienti:', error);
            return;
        }

        const clientiTableBody = document.getElementById('clienti-table').querySelector('tbody');
        clientiTableBody.innerHTML = clients.map(client => `
            <tr>
                <td>${client.name}</td>
                <td>${client.email}</td>
                <td>${client.phone}</td>
                <td>
                    <button class="delete-client" data-id="${client.id}">Elimina</button>
                </td>
            </tr>
        `).join('');

        // Aggiungi eventi per i pulsanti di eliminazione
        document.querySelectorAll('.delete-client').forEach(button => {
            button.addEventListener('click', async (e) => {
                const clientId = e.target.getAttribute('data-id');
                await deleteClient(clientId);
                await loadClients();
            });
        });
    };

    // Funzione per eliminare un cliente
    const deleteClient = async (id) => {
        const { error } = await supabaseClient
            .from('clients')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Errore nell\'eliminazione del cliente:', error);
        }
    };

    // Funzione per caricare gli appuntamenti
    const loadAppointments = async () => {
        const { data: appointments, error } = await supabaseClient
            .from('appointments')
            .select('*, clients(name)');

        if (error) {
            console.error('Errore nel caricamento degli appuntamenti:', error);
            return;
        }

        const appuntamentiTableBody = document.getElementById('appuntamenti-table').querySelector('tbody');
        appuntamentiTableBody.innerHTML = appointments.map(appointment => `
            <tr>
                <td>${appointment.clients.name}</td>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td>
                    <button class="delete-appointment" data-id="${appointment.id}">Elimina</button>
                </td>
            </tr>
        `).join('');

        // Aggiungi eventi per i pulsanti di eliminazione
        document.querySelectorAll('.delete-appointment').forEach(button => {
            button.addEventListener('click', async (e) => {
                const appointmentId = e.target.getAttribute('data-id');
                await deleteAppointment(appointmentId);
                await loadAppointments();
            });
        });
    };

    // Funzione per eliminare un appuntamento
    const deleteAppointment = async (id) => {
        const { error } = await supabaseClient
            .from('appointments')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Errore nell\'eliminazione dell\'appuntamento:', error);
        }
    };

    // Funzione per aggiungere un nuovo cliente
    const addClientForm = document.getElementById('add-client-form');
    addClientForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('client-name').value;
        const email = document.getElementById('client-email').value;
        const phone = document.getElementById('client-phone').value;

        const { error } = await supabaseClient
            .from('clients')
            .insert([{ name, email, phone }]);

        if (error) {
            console.error('Errore nell\'aggiunta del cliente:', error);
            return;
        }

        addClientForm.reset();
        await loadClients();
    });

    // Funzione per aggiungere un nuovo appuntamento
    const addAppointmentForm = document.getElementById('add-appointment-form');
    addAppointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const clientId = document.getElementById('appointment-client').value;
        const date = document.getElementById('appointment-date').value;
        const time = document.getElementById('appointment-time').value;

        const { error } = await supabaseClient
            .from('appointments')
            .insert([{ client_id: clientId, date, time }]);

        if (error) {
            console.error('Errore nell\'aggiunta dell\'appuntamento:', error);
            return;
        }

        addAppointmentForm.reset();
        await loadAppointments();
    });

    // Funzione per popolare il menu a tendina dei clienti nel modulo appuntamenti
    const populateClientDropdown = async () => {
        const { data: clients, error } = await supabaseClient
            .from('clients')
            .select('*');

        if (error) {
            console.error('Errore nel caricamento dei clienti per il menu a tendina:', error);
            return;
        }

        const clientDropdown = document.getElementById('appointment-client');
        clientDropdown.innerHTML = clients.map(client => `
            <option value="${client.id}">${client.name}</option>
        `).join('');
    };

    // Funzione per caricare i trattamenti
    const loadTreatments = async () => {
        try {
            const { data: treatments, error } = await supabaseClient
                .from('treatments')
                .select('*');

            if (error) {
                console.error('Errore nel caricamento dei trattamenti:', error);
                return;
            }

            console.log('Trattamenti caricati:', treatments);

            const trattamentiTableBody = document.getElementById('trattamenti-table').querySelector('tbody');
            trattamentiTableBody.innerHTML = treatments.map(treatment => `
                <tr>
                    <td>${treatment.name}</td>
                    <td>${treatment.description}</td>
                    <td>€${(treatment.price || 0).toFixed(2)}</td>
                    <td><img src="${treatment.image_url}" alt="${treatment.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
                    <td>
                        <button class="edit-treatment" data-id="${treatment.id}">Modifica</button>
                        <button class="delete-treatment" data-id="${treatment.id}">Elimina</button>
                    </td>
                </tr>
            `).join('');

            // Aggiungi eventi per i pulsanti di eliminazione
            document.querySelectorAll('.delete-treatment').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const treatmentId = e.target.getAttribute('data-id');
                    await deleteTreatment(treatmentId);
                    await loadTreatments();
                });
            });

            // Aggiungi eventi per i pulsanti di modifica
            document.querySelectorAll('.edit-treatment').forEach(button => {
                button.addEventListener('click', (e) => {
                    const treatmentId = e.target.getAttribute('data-id');
                    const treatment = treatments.find(t => t.id === parseInt(treatmentId));
                    if (treatment) {
                        populateEditForm(treatment);
                    } else {
                        console.error('Trattamento non trovato:', treatmentId);
                    }
                });
            });
        } catch (err) {
            console.error('Errore imprevisto nel caricamento dei trattamenti:', err);
        }
    };

    // Funzione per aggiungere un nuovo trattamento
    const addTreatmentForm = document.getElementById('add-treatment-form');
    addTreatmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('treatment-name').value.trim();
        const description = document.getElementById('treatment-description').value.trim();
        const price = parseFloat(document.getElementById('treatment-price').value) || 0.00;
        const image_url = document.getElementById('treatment-image').value.trim();

        // Validazione dell'URL dell'immagine
        const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/;
        if (!urlPattern.test(image_url)) {
            alert('Inserisci un URL valido per l\'immagine.');
            return;
        }

        if (!name || !description || !image_url) {
            alert('Tutti i campi sono obbligatori.');
            return;
        }

        try {
            const { error } = await supabaseClient
                .from('treatments')
                .insert([{ name, description, price, image_url }]);

            if (error) {
                console.error('Errore nell\'aggiunta del trattamento:', error);
                alert('Errore durante l\'aggiunta del trattamento. Riprova.');
                return;
            }

            console.log('Trattamento aggiunto con successo.');
            addTreatmentForm.reset();
            await loadTreatments();
        } catch (err) {
            console.error('Errore imprevisto durante l\'aggiunta del trattamento:', err);
        }
    });

    // Funzione per eliminare un trattamento
    const deleteTreatment = async (id) => {
        try {
            console.log(`Tentativo di eliminazione del trattamento con ID: ${id}`);
            const { data, error } = await supabaseClient
                .from('treatments')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Errore nell\'eliminazione del trattamento:', error);
                alert('Errore durante l\'eliminazione del trattamento. Riprova.');
            } else {
                console.log('Trattamento eliminato con successo:', data);
            }
        } catch (err) {
            console.error('Errore imprevisto durante l\'eliminazione del trattamento:', err);
        }
    };

    // Funzione per popolare il modulo di modifica
    const populateEditForm = (treatment) => {
        console.log('Popolamento del modulo di modifica con i dati del trattamento:', treatment);
        document.getElementById('edit-treatment-id').value = treatment.id;
        document.getElementById('edit-treatment-name').value = treatment.name;
        document.getElementById('edit-treatment-description').value = treatment.description;
        document.getElementById('edit-treatment-price').value = treatment.price;
        document.getElementById('edit-treatment-image').value = treatment.image_url;

        // Rendi visibile il modulo di modifica
        document.getElementById('edit-treatment-section').style.display = 'block';
    };

    // Funzione per aggiornare un trattamento
    const editTreatmentForm = document.getElementById('edit-treatment-form');
    editTreatmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('edit-treatment-id').value;
        const name = document.getElementById('edit-treatment-name').value.trim();
        const description = document.getElementById('edit-treatment-description').value.trim();
        const price = parseFloat(document.getElementById('edit-treatment-price').value) || 0.00;
        const image_url = document.getElementById('edit-treatment-image').value.trim();

        if (!name || !description || !image_url) {
            alert('Tutti i campi sono obbligatori.');
            return;
        }

        try {
            console.log(`Tentativo di aggiornamento del trattamento con ID: ${id}`);
            const { data, error } = await supabaseClient
                .from('treatments')
                .update({ name, description, price, image_url })
                .eq('id', id);

            if (error) {
                console.error('Errore nell\'aggiornamento del trattamento:', error);
                alert('Errore durante l\'aggiornamento del trattamento. Riprova.');
                return;
            }

            console.log('Trattamento aggiornato con successo:', data);
            editTreatmentForm.reset();
            document.getElementById('edit-treatment-section').style.display = 'none';
            await loadTreatments();
        } catch (err) {
            console.error('Errore imprevisto durante l\'aggiornamento del trattamento:', err);
        }
    });

    // Gestione delle schede con animazione
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Rimuovi la classe "active" da tutte le schede e sezioni
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Aggiungi la classe "active" alla scheda e alla sezione selezionata
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            const activeTab = document.getElementById(tabId);
            activeTab.classList.add('active');
        });
    });

    // Carica i dati iniziali
    await loadClients();
    await loadAppointments();
    await loadTreatments();
    await populateClientDropdown();
    
    const backgroundForm = document.getElementById('background-form');
    const backgroundMessage = document.getElementById('background-message');

    backgroundForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('background-image');
        const file = fileInput.files[0];

        if (!file) {
            backgroundMessage.textContent = 'Seleziona un file prima di caricare.';
            return;
        }

        try {
            // Carica l'immagine su Supabase
            const fileName = `background-${Date.now()}-${file.name}`;
            const { data, error } = await supabaseClient.storage
                .from('background-images')
                .upload(fileName, file);

            if (error) {
                console.error('Errore durante il caricamento:', error);
                backgroundMessage.textContent = 'Errore durante il caricamento. Riprova.';
                return;
            }

            // Ottieni l'URL pubblico dell'immagine
            const { publicURL } = supabaseClient.storage
                .from('background-images')
                .getPublicUrl(fileName);

            if (!publicURL) {
                backgroundMessage.textContent = 'Errore nel recupero dell\'URL pubblico.';
                return;
            }

            // Aggiorna il database con il nuovo URL
            const { error: dbError } = await supabaseClient
                .from('settings')
                .upsert({ key: 'background_image', value: publicURL });

            if (dbError) {
                console.error('Errore durante l\'aggiornamento del database:', dbError);
                backgroundMessage.textContent = 'Errore durante l\'aggiornamento del database.';
                return;
            }

            backgroundMessage.textContent = 'Sfondo aggiornato con successo!';
        } catch (err) {
            console.error('Errore imprevisto:', err);
            backgroundMessage.textContent = 'Errore imprevisto. Riprova.';
        }
    });
});
