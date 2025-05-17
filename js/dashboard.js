import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Funzione per caricare i clienti
    const loadClients = async () => {
        const clientiTable = document.getElementById('clienti-table');
        if (!clientiTable) return; // Evita errori se la tabella non esiste

        const clientiTableBody = clientiTable.querySelector('tbody');
        if (!clientiTableBody) return; // Evita errori se tbody non esiste

        const { data: clients, error } = await supabase
            .from('clients')
            .select('*');

        if (error) {
            console.error('Errore nel caricamento dei clienti:', error);
            return;
        }

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
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Errore nell\'eliminazione del cliente:', error);
        }
    };

    // Funzione per caricare gli appuntamenti
    const loadAppointments = async () => {
        const appuntamentiTable = document.getElementById('appuntamenti-table');
        if (!appuntamentiTable) return; // Evita errori se la tabella non esiste

        const appuntamentiTableBody = appuntamentiTable.querySelector('tbody');
        if (!appuntamentiTableBody) return; // Evita errori se tbody non esiste

        const { data: appointments, error } = await supabase
            .from('appointments')
            .select('*')
            .order('date', { ascending: true });

        if (error) {
            console.error('Errore nel caricamento degli appuntamenti:', error);
            return;
        }

        appuntamentiTableBody.innerHTML = appointments.map(appointment => `
            <tr>
                <td>${appointment.client_name || ''}</td>
                <td>${appointment.phone || ''}</td>
                <td>${appointment.date || ''}</td>
                <td>${appointment.time || ''}</td>
                <td>${appointment.notes || ''}</td>
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
        const { error } = await supabase
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
        const email = document.getElementById('client-email').value; // <-- CORRETTO QUI
        const phone = document.getElementById('client-phone').value;

        const { error } = await supabase
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

        const clientName = document.getElementById('appointment-client-name').value.trim();
        const phone = document.getElementById('appointment-phone').value.trim();
        const date = document.getElementById('appointment-date').value;
        const time = document.getElementById('appointment-time').value;
        const notes = document.getElementById('appointment-notes').value.trim();

        // Inserisci client_name come campo testo libero
        const appointmentData = { date, time };
        if (clientName) {
            appointmentData.client_name = clientName;
        }
        if (phone) {
            appointmentData.phone = phone;
        }
        if (notes) {
            appointmentData.notes = notes;
        }

        const { error } = await supabase
            .from('appointments')
            .insert([appointmentData]);

        if (error) {
            console.error('Errore nell\'aggiunta dell\'appuntamento:', error);
            return;
        }

        addAppointmentForm.reset();
        await loadAppointments();
    });

    // Funzione per caricare i trattamenti
    const loadTreatments = async () => {
        try {
            const { data: treatments, error } = await supabase
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
                    <td>${treatment.name || ''}</td>
                    <td>${treatment.description || ''}</td>
                    <td>€${(treatment.price || 0).toFixed(2)}</td>
                    <td>
                        ${treatment.before_image ? `<img src="${treatment.before_image}" alt="Prima" style="width: 50px; height: 50px; object-fit: cover;">` : ''}
                    </td>
                    <td>
                        ${treatment.after_image ? `<img src="${treatment.after_image}" alt="Dopo" style="width: 50px; height: 50px; object-fit: cover;">` : ''}
                    </td>
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
            const { error } = await supabase
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
            const { data, error } = await supabase
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
        document.getElementById('edit-treatment-before-image').value = treatment.before_image || '';
        document.getElementById('edit-treatment-after-image').value = treatment.after_image || '';

        // Mostra il modal di modifica (aggiorna se usi "edit-treatment-modal" o "edit-treatment-section")
        document.getElementById('edit-treatment-modal').style.display = 'block';
    };

    // Funzione globale per chiudere il modal di modifica trattamento
    window.closeEditModal = function() {
        document.getElementById('edit-treatment-modal').style.display = 'none';
    };

    // Funzione per aggiornare un trattamento
    const editTreatmentForm = document.getElementById('edit-treatment-form');
    editTreatmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('edit-treatment-id').value;
        const name = document.getElementById('edit-treatment-name').value.trim();
        const description = document.getElementById('edit-treatment-description').value.trim();
        const price = parseFloat(document.getElementById('edit-treatment-price').value) || 0.00;
        const before_image = document.getElementById('edit-treatment-before-image').value.trim();
        const after_image = document.getElementById('edit-treatment-after-image').value.trim();

        if (!name || !description || !before_image || !after_image) {
            alert('Tutti i campi sono obbligatori.');
            return;
        }

        try {
            console.log(`Tentativo di aggiornamento del trattamento con ID: ${id}`);
            const { data, error } = await supabase
                .from('treatments')
                .update({ name, description, price, before_image, after_image })
                .eq('id', id);

            if (error) {
                console.error('Errore nell\'aggiornamento del trattamento:', error);
                alert('Errore durante l\'aggiornamento del trattamento. Riprova.');
                return;
            }

            console.log('Trattamento aggiornato con successo:', data);
            editTreatmentForm.reset();
            document.getElementById('edit-treatment-modal').style.display = 'none';
            await loadTreatments();
        } catch (err) {
            console.error('Errore imprevisto durante l\'aggiornamento del trattamento:', err);
        }
    });

    // Funzione per caricare le disponibilità
    const loadAvailability = async () => {
        const disponibilitaTable = document.getElementById('disponibilita-table');
        if (!disponibilitaTable) return;

        const disponibilitaTableBody = disponibilitaTable.querySelector('tbody');
        if (!disponibilitaTableBody) return;

        const { data: availability, error } = await supabase
            .from('availability')
            .select('*')
            .order('date', { ascending: true });

        if (error) {
            console.error('Errore nel caricamento delle disponibilità:', error);
            return;
        }

        disponibilitaTableBody.innerHTML = availability.map(item => `
            <tr>
                <td>${item.date}</td>
                <td>${item.time}</td>
                <td>
                    <button class="delete-availability" data-id="${item.id}">Elimina</button>
                </td>
            </tr>
        `).join('');

        // Eventi per eliminare disponibilità
        document.querySelectorAll('.delete-availability').forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                await deleteAvailability(id);
                await loadAvailability();
            });
        });
    };

    // Funzione per eliminare una disponibilità
    const deleteAvailability = async (id) => {
        const { error } = await supabase
            .from('availability')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Errore durante l\'eliminazione della disponibilità:', error);
            alert('Errore durante l\'eliminazione della disponibilità');
        }
    };

    // Funzione per aggiungere una disponibilità
    const addAvailabilityForm = document.getElementById('add-availability-form');
    addAvailabilityForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const date = document.getElementById('availability-date').value;
        const time = document.getElementById('availability-time').value;

        // Inserisci sempre is_booked: false
        const { error } = await supabase
            .from('availability')
            .insert([{ date, time, is_booked: false }]);

        if (error) {
            console.error('Errore durante l\'aggiunta della disponibilità:', error);
            alert('Errore durante l\'aggiunta della disponibilità');
            return;
        }

        addAvailabilityForm.reset();
        await loadAvailability();
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
    await loadAvailability();
    
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
            const { data, error } = await supabase
                .storage
                .from('background-images')
                .upload(fileName, file);

            if (error) {
                console.error('Errore durante il caricamento:', error);
                backgroundMessage.textContent = 'Errore durante il caricamento. Riprova.';
                return;
            }

            // Ottieni l'URL pubblico dell'immagine
            const { publicURL } = supabase
                .storage
                .from('background-images')
                .getPublicUrl(fileName);

            if (!publicURL) {
                backgroundMessage.textContent = 'Errore nel recupero dell\'URL pubblico.';
                return;
            }

            // Aggiorna il database con il nuovo URL
            const { error: dbError } = await supabase
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

    async function updateBackgroundImage(imageUrl) {
        try {
            const { error } = await supabase
                .from('settings')
                .upsert({ 
                    key: 'backgroundImage',
                    value: imageUrl 
                });

            if (error) throw error;
            
            // Aggiorna il localStorage per la preview immediata nella dashboard
            localStorage.setItem('backgroundImageURL', imageUrl);
            
        } catch (error) {
            console.error('Errore nell\'aggiornamento dello sfondo:', error);
        }
    }
});
