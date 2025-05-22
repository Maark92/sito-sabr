import { supabase } from './supabaseClient.js';

const performAuthCheckAndRedirect = async (reason) => {
    console.log(`Protect-dashboard.js: Inizio controllo autenticazione (${reason})...`);

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
        console.error(`Protect-dashboard.js (${reason}): Errore nel recuperare la sessione:`, sessionError.message);
        window.location.replace('login.html');
        return false;
    }

    if (!session) {
        console.log(`Protect-dashboard.js (${reason}): Nessuna sessione valida. Reindirizzamento a login.html.`);
        window.location.replace('login.html');
        return false;
    }

    console.log(`Protect-dashboard.js (${reason}): Utente autenticato. Accesso consentito:`, session.user.email);
    return true;
};

// Controllo immediato all'esecuzione dello script
performAuthCheckAndRedirect("initial script execution");

// Listener per cambiamenti di stato dell'autenticazione
const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('Protect-dashboard.js: onAuthStateChange event:', event, 'session:', session);
    if (event === 'SIGNED_OUT' || !session) {
        console.log("Protect-dashboard.js: Evento SIGNED_OUT o sessione nulla da onAuthStateChange. Reindirizzamento.");
        window.location.replace('login.html');
    }
});

// Gestione della BFcache (Back/Forward Cache)
window.addEventListener('pageshow', function(event) {
    console.log('Protect-dashboard.js: Evento pageshow rilevato.');
    if (event.persisted) {
        console.log('Protect-dashboard.js: Pagina ripristinata dalla BFcache. Riesecuzione controllo autenticazione.');
        performAuthCheckAndRedirect("pageshow - bfcache");
    }
});