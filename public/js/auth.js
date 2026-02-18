const auth = {
    async login(email, password) {
        try {
            const data = await api.post('/api/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role
            }));
            return data;
        } catch (error) {
            throw error;
        }
    },

    async register(userData) {
        try {
            const data = await api.post('/api/auth/register', userData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role
            }));
            return data;
        } catch (error) {
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    },

    getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
};
