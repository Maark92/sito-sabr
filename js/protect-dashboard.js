import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session }, error } = await supabase.auth.getSession();

    // Se non c'è sessione o errore, logout e redirect
    if (!session || error) {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
        return;
    }

    // Controllo utente valido
    const user = session.user;
    if (!user) {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
        return;
    }

    // Controllo scadenza token
    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at && session.expires_at < now) {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
        return;
    }
});
