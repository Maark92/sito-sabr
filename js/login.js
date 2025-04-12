import { supabaseClient } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log('Tentativo di login con email:', email);

        const { data: { session }, error } = await supabaseClient.auth.signInWithPassword({ email, password });

        if (error) {
            console.error('Errore durante il login:', error);
            loginMessage.textContent = 'Errore: Credenziali non valide.';
            loginMessage.style.color = 'red';
            return;
        }

        if (session) {
            console.log('Login effettuato con successo. Sessione:', session);
            window.location.href = 'dashboard.html';
        }
    });
});
