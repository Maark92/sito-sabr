const AUTH = {
    ADMIN_EMAIL: 'admin@example.com',
    ADMIN_PASSWORD: 'password123',

    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    },

    login(email, password) {
        if (email === this.ADMIN_EMAIL && password === this.ADMIN_PASSWORD) {
            localStorage.setItem('isLoggedIn', 'true');
            return true;
        }
        return false;
    },

    logout() {
        localStorage.removeItem('isLoggedIn');
    }
};
