import { supabase } from './supabaseClient.js';

// Controllo immediato della sessione PRIMA che la dashboard venga mostrata
(async () => {
    const { data: { session }, error } = await supabase.auth.getSession();

    // Se non c'è sessione o errore, reindirizza subito (senza signOut, non serve)
    if (!session || error) {
        window.location.replace('login.html');
        return;
    }

    // Se la sessione esiste, puoi opzionalmente controllare la scadenza
    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at && session.expires_at < now) {
        window.location.replace('login.html');
        return;
    }
})();

// Listener per cambiamenti di autenticazione (logout da altra tab, scadenza, ecc.)
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || !session) {
        window.location.replace('login.html');
    }
});