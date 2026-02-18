const app = {
    init() {
        this.checkAuth();
        this.setupEventListeners();
    },

    checkAuth() {
        const user = auth.getUser();
        if (user) {
            this.showDashboard();
        } else {
            this.showLogin();
        }
    },

    setupEventListeners() {
        // Auth Forms
        document.getElementById('login-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                await auth.login(email, password);
                showToast('Login Successful');
                this.showDashboard();
            } catch (e) {
                // handled by api wrapper
            }
        });

        document.getElementById('register-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userData = {
                name: document.getElementById('reg-name').value,
                email: document.getElementById('reg-email').value,
                password: document.getElementById('reg-password').value,
                department: document.getElementById('reg-dept').value,
                designation: document.getElementById('reg-designation').value,
                salary: document.getElementById('reg-salary').value,
                role: document.getElementById('reg-role').value
            };

            try {
                await auth.register(userData);
                showToast('Registration Successful');
                this.showDashboard();
            } catch (e) {
                // handled
            }
        });

        // Navigation
        document.getElementById('show-register')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegister();
        });

        document.getElementById('show-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLogin();
        });

        document.getElementById('logout-btn')?.addEventListener('click', () => {
            auth.logout();
        });
    },

    showLogin() {
        document.getElementById('login-view').classList.remove('hidden');
        document.getElementById('register-view').classList.add('hidden');
        document.getElementById('dashboard-layout').classList.add('hidden');
    },

    showRegister() {
        document.getElementById('login-view').classList.add('hidden');
        document.getElementById('register-view').classList.remove('hidden');
        document.getElementById('dashboard-layout').classList.add('hidden');
    },

    showDashboard() {
        document.getElementById('login-view').classList.add('hidden');
        document.getElementById('register-view').classList.add('hidden');
        document.getElementById('dashboard-layout').classList.remove('hidden');

        dashboard.init();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
