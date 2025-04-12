const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minuti in millisecondi

export class SessionManager {
    static startSessionTimer() {
        if (localStorage.getItem('rememberMe') === 'true') {
            return; // Non far scadere la sessione se "ricordami" è attivo
        }

        let timeoutId = setTimeout(() => {
            this.logout();
        }, SESSION_TIMEOUT);

        // Reset del timer quando c'è attività
        document.addEventListener('mousemove', () => this.resetTimer(timeoutId));
        document.addEventListener('keypress', () => this.resetTimer(timeoutId));
    }

    static resetTimer(timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            this.logout();
        }, SESSION_TIMEOUT);
    }

    static async logout() {
        const { supabase } = await import('./supabaseClient.js');
        await supabase.auth.signOut();
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
    }
}
