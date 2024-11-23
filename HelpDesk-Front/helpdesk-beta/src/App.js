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
import RegisterForm from './pages/Forms/UserForm/RegisterForm';
import DashboardTicket from './pages/Dashboard_Ticket';


const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route element={<PrivateRoute allowedRoles={['Usuario', 'Administrador', 'Superadministrador', 'Observador']} />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="/admin" element={<PrivateRoute allowedRoles={['Administrador', 'Superadministrador', 'Observador']} />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="create-ticket" element={<CreateTicketForm />} />
            <Route path="tickets" element={<DashboardTicket />} />

            <Route path='view/:friendlyCode' element={<TicketPublication />} />


            <Route element={<PrivateRoute allowedRoles={['Administrador', 'Superadministrador']} />}>

              <Route path="users" element={<DashboardUser />} />
              <Route path="create-user" element={<CreateUserForm />} />
              <Route path="edit-user/:friendlyCode" element={<UpdateUserForm />} />
            </Route>
          </Route>
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;