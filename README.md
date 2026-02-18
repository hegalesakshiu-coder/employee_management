<<<<<<< HEAD
# employee_management
=======
# Employee Management System

A complete Employee Management System backend built with Node.js, Express.js, and MongoDB.

## Features

- **Authentication**: JWT-based login for HR and Employees.
- **Role-Based Access Control**: Separate permissions for HR and Employees.
- **Employee Management**: HR can add, remove, and view employees.
- **Leave Management**: Employees apply for leave; HR approves/rejects.
- **Attendance**: Mark daily attendance (check-in/check-out).
- **Payroll**: HR generates payroll; Employees view salary slips.

## Prerequisites

- Node.js installed
- MongoDB installed and running (or a cloud MongoDB URI)

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the root directory (if not already present) and add the following:
    ```env
    MONGO_URI=your_mongodb_connection_string
    PORT=5000
    JWT_SECRET=your_jwt_secret_key
    ```

3.  **Run the Server**
    ```bash
    npm start
    # or for development
    npm run dev
    ```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login

### Employees
- `GET /api/employees` - Get all employees (HR only)
- `POST /api/employees` - Create a new employee (HR only)
- `GET /api/employees/profile` - Get current user profile
- `DELETE /api/employees/:id` - Delete employee (HR only)

### Leaves
- `POST /api/leaves` - Apply for leave
- `GET /api/leaves` - Get leaves (HR: all, Employee: own)
- `PUT /api/leaves/:id` - Approve/Reject leave (HR only)

### Attendance
- `POST /api/attendance` - Mark attendance (Check-in/Check-out)
- `GET /api/attendance` - Get attendance records

### Payroll
- `POST /api/payroll` - Generate payroll (HR only)
- `GET /api/payroll` - Get payroll records

## Project Structure

- `config/` - Database configuration
- `models/` - Mongoose schemas
- `controllers/` - Route logic
- `routes/` - API routes
- `middleware/` - Auth and error handling mechanisms
>>>>>>> a298723 (employee_management)
