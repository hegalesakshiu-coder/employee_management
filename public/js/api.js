const API_URL = 'http://localhost:5000/api';

const api = {
    async request(endpoint, method = 'GET', body = null) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(endpoint, config);
            const data = await response.json();

            if (!response.ok) {
                // If unauthorized (401), clear token
                if (response.status === 401) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    window.location.reload();
                }
                throw new Error(data.message || 'Something went wrong');
            }
            return data;
        } catch (error) {
            console.error('API Error:', error);
            showToast(error.message, 'error');
            throw error;
        }
    },

    get(endpoint) {
        return this.request(endpoint, 'GET');
    },

    post(endpoint, body) {
        return this.request(endpoint, 'POST', body);
    },

    put(endpoint, body) {
        return this.request(endpoint, 'PUT', body);
    },

    delete(endpoint) {
        return this.request(endpoint, 'DELETE');
    }
};

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.className = `toast toast-${type} show`;
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}
