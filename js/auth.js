import { supabase } from './supabaseClient.js';

export const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
};

export const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;
    return data;
};

export const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = '/login.html';
};
