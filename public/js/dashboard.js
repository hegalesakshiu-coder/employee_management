const dashboard = {
    async init() {
        const user = auth.getUser();
        if (!user) return;

        document.getElementById('user-name').textContent = `${user.name} (${user.role})`;

        // Show/Hide Nav Items based on Role
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.dataset.role === user.role) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        // Initialize Views
        if (user.role === 'HR') {
            this.switchView('hr-dashboard');
            await this.loadHRData();
        } else {
            this.switchView('emp-dashboard');
            await this.loadEmployeeData();
        }

        this.setupEventListeners();
    },

    switchView(viewId) {
        // Hide all views
        document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
        // Show target view
        document.getElementById(`view-${viewId}`)?.classList.remove('hidden');

        // Update Nav Active State
        document.querySelectorAll('.nav-links a').forEach(el => {
            if (el.dataset.view === viewId) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    },

    setupEventListeners() {
        // Navigation Click Events
        document.querySelectorAll('.nav-links a').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.dataset.view;
                this.switchView(view);
            });
        });

        // Employee Actions
        document.getElementById('mark-attendance-btn')?.addEventListener('click', async () => {
            try {
                const res = await api.post('/api/attendance');
                showToast(res.message);
                this.loadEmployeeData();
            } catch (e) {
                // handled by api wrapper
            }
        });

        document.getElementById('leave-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const leaveData = {
                leaveType: document.getElementById('leave-type').value,
                startDate: document.getElementById('leave-start').value,
                endDate: document.getElementById('leave-end').value,
                reason: document.getElementById('leave-reason').value
            };

            try {
                await api.post('/api/leaves', leaveData);
                showToast('Leave applied successfully');
                document.getElementById('leave-form').reset();
                this.switchView('emp-history'); // Switch to history view
                this.loadEmployeeData();
            } catch (e) {
                // handled
            }
        });
    },

    async loadHRData() {
        try {
            // Load Employees Count
            const employees = await api.get('/api/employees');
            document.getElementById('total-employees').textContent = employees.length;

            // Load Leaves
            const leaves = await api.get('/api/leaves');
            const pendingLeaves = leaves.filter(l => l.status === 'Pending');
            document.getElementById('pending-leaves-count').textContent = pendingLeaves.length;

            this.renderLeavesTable(leaves);
            this.renderRecentPending(pendingLeaves);
        } catch (e) {
            console.error(e);
        }
    },

    renderRecentPending(pendingLeaves) {
        const tbody = document.getElementById('hr-recent-pending-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        // Show max 5
        const recent = pendingLeaves.slice(0, 5);

        recent.forEach(leave => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${leave.user ? leave.user.name : 'Unknown'}</td>
                <td>${leave.leaveType}</td>
                <td>${new Date(leave.startDate).toLocaleDateString()} - ${new Date(leave.endDate).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-primary" onclick="dashboard.updateLeave('${leave._id}', 'Approved')" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; margin-right: 0.5rem">Approve</button>
                    <button class="btn btn-danger" onclick="dashboard.updateLeave('${leave._id}', 'Rejected')" style="padding: 0.25rem 0.5rem; font-size: 0.8rem">Reject</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        if (recent.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">No pending requests</td></tr>';
        }
    },

    renderLeavesTable(leaves) {
        const pendingBody = document.getElementById('leaves-pending-body');
        const historyBody = document.getElementById('leaves-history-body');

        if (!pendingBody || !historyBody) return;

        pendingBody.innerHTML = '';
        historyBody.innerHTML = '';

        leaves.forEach(leave => {
            const tr = document.createElement('tr');

            if (leave.status === 'Pending') {
                tr.innerHTML = `
                    <td>${leave.user ? leave.user.name : 'Unknown'}</td>
                    <td>${leave.leaveType}</td>
                    <td>${new Date(leave.startDate).toLocaleDateString()} - ${new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>${leave.reason}</td>
                    <td>
                        <button class="btn btn-primary" onclick="dashboard.updateLeave('${leave._id}', 'Approved')" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; margin-right: 0.5rem">Approve</button>
                        <button class="btn btn-danger" onclick="dashboard.updateLeave('${leave._id}', 'Rejected')" style="padding: 0.25rem 0.5rem; font-size: 0.8rem">Reject</button>
                    </td>
                `;
                pendingBody.appendChild(tr);
            } else {
                tr.innerHTML = `
                    <td>${leave.user ? leave.user.name : 'Unknown'}</td>
                    <td>${leave.leaveType}</td>
                    <td>${new Date(leave.startDate).toLocaleDateString()} - ${new Date(leave.endDate).toLocaleDateString()}</td>
                    <td><span class="status-badge status-${leave.status.toLowerCase()}">${leave.status}</span></td>
                `;
                historyBody.appendChild(tr);
            }
        });
    },

    async updateLeave(id, status) {
        try {
            await api.put(`/api/leaves/${id}`, { status });
            showToast(`Leave ${status}`);
            this.loadHRData();
        } catch (e) {
            console.error(e);
        }
    },

    async loadEmployeeData() {
        // Load Attendance
        try {
            const attendance = await api.get('/api/attendance');
            // Check today
            const today = new Date().toDateString();
            const todayRecord = attendance.find(a => new Date(a.date).toDateString() === today);

            if (todayRecord) {
                if (todayRecord.checkOut) {
                    document.getElementById('attendance-status').textContent = 'Checked Out';
                    document.getElementById('mark-attendance-btn')?.classList.add('hidden');
                } else {
                    document.getElementById('attendance-status').textContent = 'Checked In';
                    const btn = document.getElementById('mark-attendance-btn');
                    if (btn) {
                        btn.textContent = 'Check Out';
                        btn.classList.remove('hidden');
                    }
                }
            } else {
                document.getElementById('attendance-status').textContent = 'Not Marked';
                const btn = document.getElementById('mark-attendance-btn');
                if (btn) {
                    btn.textContent = 'Check In';
                    btn.classList.remove('hidden');
                }
            }

            // Load Leaves History
            const leaves = await api.get('/api/leaves');

            const pendingBody = document.getElementById('emp-pending-body');
            const processedBody = document.getElementById('emp-processed-body');

            if (pendingBody && processedBody) {
                pendingBody.innerHTML = '';
                processedBody.innerHTML = '';

                leaves.forEach(leave => {
                    const tr = document.createElement('tr');
                    const content = `
                        <td>${leave.leaveType}</td>
                        <td>${new Date(leave.startDate).toLocaleDateString()} - ${new Date(leave.endDate).toLocaleDateString()}</td>
                        <td>${leave.reason}</td>
                        <td><span class="status-badge status-${leave.status.toLowerCase()}">${leave.status}</span></td>
                    `;
                    tr.innerHTML = content;

                    if (leave.status === 'Pending') {
                        pendingBody.appendChild(tr);
                    } else {
                        processedBody.appendChild(tr);
                    }
                });
            }

        } catch (e) {
            console.error(e);
        }
    }
};

// Make dashboard global for onclick events
window.dashboard = dashboard;
