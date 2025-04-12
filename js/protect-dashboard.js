import { supabaseClient } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Verifica della sessione utente per la dashboard...');

        // Ottieni la sessione dell'utente
        const { data: { session }, error } = await supabaseClient.auth.getSession();

        if (error || !session) {
            console.warn('Sessione non valida o utente non autenticato. Reindirizzamento al login.');
            window.location.href = 'login.html';
            return;
        }

        console.log('Utente autenticato:', session.user.email);

        // Configura il pulsante di logout
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', async () => {
                const { error } = await supabaseClient.auth.signOut();
                if (error) {
                    console.error('Errore durante il logout:', error);
                } else {
                    console.log('Logout effettuato con successo.');
                    window.location.href = 'login.html';
                }
            });
        }
    } catch (err) {
        console.error('Errore durante la verifica dell\'autenticazione:', err);
        window.location.href = 'login.html';
    }
});
