import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './components/AdminLayout';
import Unauthorized from './pages/Unauthorized';
import CreateUserForm from './pages/Forms/UserForm/UserForm';
import UpdateUserForm from './pages/Forms/UserForm/UpdateUserForm';
import DashboardUser from './pages/Dashboard_User';
import DashboardHome from './pages/DashboardHome';
import CreateTicketForm from './pages/Forms/TicketForm/TicketForm';
import TicketPublication from './pages/TicketPublication';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<CreateUserForm />} />
        <Route element={<PrivateRoute allowedRoles={['Usuario']} />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['Administrador', 'Superadministrador', 'Observador']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="create-ticket" element={<CreateTicketForm />} />
            <Route path="users" element={<DashboardUser/>} />
            <Route path="create-user" element={<CreateUserForm />} />
            <Route path="reports" element={<TicketPublication />} />
            <Route path="edit-user/:friendlyCode" element={<UpdateUserForm />} /> {/* Ruta para la edición de usuarios */}
          </Route>
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </AuthProvider>
  );
};


export default App;